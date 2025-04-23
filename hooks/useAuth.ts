import { useLoading } from "@/contexts/LoadingContext";
import { useCurrentTrack } from "@/contexts/CurrentTrackContext";
import { useRecordings } from "@/contexts/RecordingsContext";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorageService, {
  AsyncStorageKeys,
} from "@/services/AsyncStorageService";
import { notificationService } from "@/services/NotificationService";
import {
  GoogleAuthError,
  googleAuthService,
} from "@/services/GoogleAuthService";
import { AppleAuthError, appleAuthService } from "@/services/AppleAuthService";
import { Alert } from "react-native";
import { useUser } from "@/contexts/UserContext";
import Parse from "@/services/Parse";

import { userManagementService } from "@/services/UserManagementService";
import { emailAuthService } from "@/services/EmailAuthService";

// Export login method type
export type LoginMethod = "email" | "google" | "apple";

// Handles Login, Logout, and Session Management

export const useAuth = () => {
  const { showLoading, hideLoading } = useLoading();
  const { resetCurrentTrack } = useCurrentTrack();
  const { resetRecordings } = useRecordings();
  const { updateCurrentUserData, getCurrentUserData } = useUser();

  const getCurrentUser = async () => {
    const user = await Parse.User.currentAsync();
    return user;
  };

  const socialLogoutMethod = async (method: LoginMethod) => {
    if (method === "google") {
      await googleAuthService.socialSignOut();
    }

    // Apple signout shows login screen when signing out
    // so we don't need to call socialSignOut
    // else if (method === "apple") {
    //   await appleAuthService.socialSignOut();
    // }
    // No action needed for "email" method
  };

  const getLoginMethod = async (
    ignoreError: boolean = false
  ): Promise<LoginMethod | null> => {
    const loginMethod = (await AsyncStorageService.getItem(
      AsyncStorageKeys.SIGN_IN_METHOD
    )) as LoginMethod | null;

    if (!loginMethod && !ignoreError) {
      throw new Error("No sign in method found");
    }

    return loginMethod;
  };

  /**
   * Performs a logout operation.
   * If no sign in method is found, it defaults to email.
   */
  const performLogout = async () => {
    try {
      showLoading();

      // Get current sign in method
      let method = await getLoginMethod();

      if (!method) {
        method = "email";
      }

      // 4. Reset app state
      resetCurrentTrack();
      resetRecordings();

      // 1. Logout from social provider if applicable
      await socialLogoutMethod(method);

      // 3. Clear AsyncStorage
      await AsyncStorageService.clear();

      // 2. Logout from Parse
      await Parse.User.logOut();

      return { success: true };
    } catch (error: any) {
      if (error.message === "Invalid session token") {
        return { success: true };
      }

      console.log("Logout error:", error);
      Alert.alert("Error", "An unexpected error occurred during logout");
      return { success: false, error: error.message };
    } finally {
      hideLoading();
    }
  };

  const performLogin = async (
    method: LoginMethod,
    username?: string,
    password?: string
  ) => {
    showLoading();
    try {
      let loginResponse;

      // Choose login method based on type
      if (method === "google") {
        loginResponse = await googleAuthService.loginWithGoogle();
      } else if (method === "apple") {
        loginResponse = await appleAuthService.loginWithApple();
      } else if (method === "email" && username && password) {
        loginResponse = await emailAuthService.loginWithEmailAndPassword(
          username,
          password
        );
      }

      if (loginResponse?.success) {
        await onSuccessfulLogin(loginResponse.user!, method);

        return { success: true };
      }
    } catch (error: any) {
      if (
        error.message === AppleAuthError.CANCELED ||
        error.message === GoogleAuthError.CANCELED
      ) {
        return { success: false, error: error.message };
      }

      // Alert.alert("Failed to login", error.message);
      console.error("Login error:", error);
      return { success: false, error: error.message };
    } finally {
      hideLoading();
    }
  };

  const performEmailSignUp = async (email: string, password: string) => {
    try {
      const result = await emailAuthService.signUpWithEmailAndPassword(
        email,
        password
      );
      if (result?.success) {
        await onSuccessfulLogin(result.user!, "email");

        return { success: true };
      }
    } catch (error: any) {
      console.log("Email signup error:", error);
      Alert.alert("Error", "Failed to sign up");
      return { success: false, error: error.message };
    }
  };

  const attemptToLogin = async () => {
    // showLoading();
    let currentUser;
    let loginMethod: LoginMethod | null;

    try {
      // If the session is valid, get the user from the session
      const session = await Parse.Session.current();
      currentUser = session.get("user");
      loginMethod = await getLoginMethod();

      if (currentUser && loginMethod) {
        onSuccessfulLogin(currentUser, loginMethod);
        return;
      }

      // Hide the splash screen if user is not logged in
      SplashScreen.hideAsync();
    } catch (error: any) {
      console.log("error attempting to login: ", error.message);

      // If the session is invalid, logout the user
      if (error.message === "Invalid session token") {
        await performLogout(); // Default to email if method unknown during auto-login
      }

      // Hide the splash screen if error
      SplashScreen.hideAsync();
    }
  };

  const navigateBasedOnUserCredentials = async (
    user: Parse.User,
    groupId: string
  ) => {
    if (!user.get("firstName") || !user.get("lastName")) {
      router.navigate("/name");
      return;
    }

    if (groupId) {
      router.navigate("/(authenticated)/(tabs)");
    } else {
      router.navigate("/chooseYourGroup");
    }
  };

  async function onSuccessfulLogin(user: Parse.User, loginMethod: LoginMethod) {
    const groupIdsResult = await userManagementService.getUserGroupIds(user.id);
    const groupId = groupIdsResult.groupIds?.[0] || "";

    await AsyncStorageService.setItem(
      AsyncStorageKeys.SIGN_IN_METHOD,
      loginMethod
    );

    updateCurrentUserData(
      user.get("firstName"),
      user.get("lastName"),
      user.get("email"),
      user.get("profileUrl"),
      groupId
    );

    navigateBasedOnUserCredentials(user, groupId);
  }

  // Checks if the user is fully authenticated
  // we put this function here and not in the AuthService
  // because it uses the useUser hook
  async function isFullyAuthenticated() {
    try {
      // throws an error if the session is invalid
      const session = await Parse.Session.current();

      const { groupId } = getCurrentUserData();

      return session.get("user") && groupId;
    } catch (error) {
      console.log("error checking if user is authenticated: ", error);
      return false;
    }
  }

  async function logoutIfNotFullyAuthenticated() {
    // If the user is not fully authenticated, logout the user
    const isAuthenticated = await isFullyAuthenticated();
    if (!isAuthenticated) {
      await performLogout(); // Default to email method if we don't know
    }
  }

  async function verifyAuth() {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: "User not logged in",
      };
    }
    return { success: true };
  }

  return {
    performLogout,
    getCurrentUser,
    performLogin,
    performEmailSignUp,
    attemptToLogin,
    isFullyAuthenticated,
    logoutIfNotFullyAuthenticated,
    verifyAuth,
    getLoginMethod,
  };
};
