import { useLoading } from "@/contexts/LoadingContext";
import { useCurrentTrack } from "@/contexts/CurrentTrackContext";
import { useRecordings } from "@/contexts/RecordingsContext";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorageService, {
  AsyncStorageKeys,
} from "@/services/AsyncStorageService";
import { notificationService } from "@/services/NotificationService";
import { googleAuthService } from "@/services/GoogleAuthService";
import { appleAuthService } from "@/services/AppleAuthService";
import { Alert } from "react-native";
import { useUser } from "@/contexts/UserContext";
import Parse from "@/services/Parse";

import { userManagementService } from "@/services/UserManagementService";

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

  const performLogout = async () => {
    let method: LoginMethod;
    try {
      showLoading();

      // Get current sign in method
      method = (await AsyncStorageService.getItem(
        AsyncStorageKeys.SIGN_IN_METHOD
      )) as LoginMethod;

      if (!method) {
        throw new Error("No sign in method found");
      }

      // 1. Logout from social provider if applicable
      await socialLogoutMethod(method);

      // 2. Clear AsyncStorage
      await AsyncStorageService.clear();

      // 3. Logout from Parse
      await Parse.User.logOut();

      // 4. Reset app state
      router.dismissAll();
      resetCurrentTrack();
      resetRecordings();

      return { success: true };
    } catch (error: any) {
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
    try {
      let loginResponse;

      // Choose login method based on type
      if (method === "google") {
        loginResponse = await googleAuthService.loginWithGoogle();
      } else if (method === "apple") {
        loginResponse = await appleAuthService.loginWithApple();
      } else if (method === "email" && username && password) {
        // Email login will be implemented later
        // loginResponse = await emailAuthService.loginWithEmail(username, password);
        throw new Error("Email login not implemented yet");
      } else {
        throw new Error("Invalid login method or missing credentials");
      }

      showLoading();
      if (loginResponse?.success) {
        await AsyncStorageService.setItem(
          AsyncStorageKeys.SIGN_IN_METHOD,
          method
        );
        await onSuccessfulLogin(loginResponse.user!);
        return { success: true };
      } else {
        throw new Error(loginResponse?.error || "Login failed");
      }
    } catch (error: any) {
      console.log("Login error:", error);
      Alert.alert(
        "Login Error",
        error.message || "Failed to login. Please try again."
      );
      return { success: false, error: error.message };
    } finally {
      hideLoading();
    }
  };

  const attemptToLogin = async () => {
    // showLoading();
    let currentUser;

    try {
      // If the session is valid, get the user from the session
      const session = await Parse.Session.current();
      currentUser = session.get("user");

      if (currentUser) {
        onSuccessfulLogin(currentUser);
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

  async function onSuccessfulLogin(user: Parse.User) {
    const groupIdsResult = await userManagementService.getUserGroupIds(user.id);
    const groupId = groupIdsResult.groupIds?.[0] || "";

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
    attemptToLogin,
    isFullyAuthenticated,
    logoutIfNotFullyAuthenticated,
    verifyAuth,
  };
};
