import { useLoading } from "@/contexts/LoadingContext";
import { useCurrentTrack } from "@/contexts/CurrentTrackContext";
import { useRecordings } from "@/contexts/RecordingsContext";
import { router } from "expo-router";
import AsyncStorageService, {
  AsyncStorageKeys,
} from "@/services/AsyncStorageService";
import { notificationService } from "@/services/NotificationService";
import { authService } from "@/services/AuthService";
import { Alert } from "react-native";
import { useUser } from "@/contexts/UserContext";
import Parse from "@/services/Parse";

import { userManagementService } from "@/services/UserManagementService";

// Handles Login, Logout, and Session Management

export const useAuth = () => {
  const { showLoading, hideLoading } = useLoading();
  const { resetCurrentTrack } = useCurrentTrack();
  const { resetRecordings } = useRecordings();
  const { updateCurrentUserData, getCurrentUserData } = useUser();

  const performLogout = async () => {
    const pushToken = await AsyncStorageService.getItem(
      AsyncStorageKeys.PUSH_TOKEN
    );

    try {
      showLoading();
      await AsyncStorageService.clear();
      await notificationService.deletePushNotificationToken(pushToken || "");

      await authService.logout();

      router.dismissAll();
      resetCurrentTrack();
      resetRecordings();
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      hideLoading();
    }
  };

  const attemptToLogin = async () => {
    showLoading();
    let currentUser;

    try {
      // If the session is valid, get the user from the session
      const session = await Parse.Session.current();
      currentUser = session.get("user");

      if (currentUser) {
        onSuccessfulLogin(currentUser);
      }
    } catch (error: any) {
      console.log("error attempting to login: ", error.message);

      // If the session is invalid, logout the user
      if (error.message === Parse.Error.INVALID_SESSION_TOKEN) {
        await authService.logout();
      }
      hideLoading();
    }
    hideLoading();
  };

  const handleLogin = async () => {
    showLoading();
    let loginResponse = null;

    try {
      loginResponse = await authService.loginWithGoogle();
      if (loginResponse.success) {
        onSuccessfulLogin(loginResponse.user!);
      }
    } catch (error: any) {
      console.log("error", error.message);
      hideLoading();
      Alert.alert("Error", "Failed to login. Please try again.");
    }

    hideLoading();
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

    authService.navigateBasedOnUserCredentials(user, groupId);
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
      await performLogout();
    }
  }

  return {
    performLogout,
    attemptToLogin,
    handleLogin,
    isFullyAuthenticated,
    logoutIfNotFullyAuthenticated,
  };
};
