import { useLoading } from "@/contexts/LoadingContext";
import { useCurrentTrack } from "@/contexts/CurrentTrackContext";
import { useRecordings } from "@/contexts/RecordingsContext";
import { router } from "expo-router";
import AsyncStorageService, {
  AsyncStorageKeys,
} from "@/services/AsyncStorageService";
import { notificationService } from "@/services/NotificationService";
import { authService, UserStatus } from "@/services/AuthService";
import { Alert } from "react-native";
import { useUser } from "@/contexts/UserContext";
export const useAuth = () => {
  const { showLoading, hideLoading } = useLoading();
  const { resetCurrentTrack } = useCurrentTrack();
  const { resetRecordings } = useRecordings();
  const { updateCurrentUserData } = useUser();
  const performLogout = async () => {
    const pushToken = await AsyncStorageService.getItem(
      AsyncStorageKeys.PUSH_TOKEN
    );

    try {
      showLoading();
      await AsyncStorageService.clear();
      await notificationService.deletePushNotificationToken(pushToken || "");

      const result = await authService.logout();

      if (result.success) {
        router.dismissAll();
        resetCurrentTrack();
        resetRecordings();
      } else {
        Alert.alert("Error", "Failed to logout");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      hideLoading();
    }
  };

  const attemptToLogin = async () => {
    showLoading();
    const currentUser = await authService.getCurrentUser();
    let userStatus: UserStatus;

    try {
      if (currentUser) {
        userStatus = await authService.getUserStatus(currentUser);
        updateCurrentUserData(
          currentUser.get("firstName"),
          currentUser.get("lastName"),
          currentUser.get("email"),
          currentUser.get("profileUrl")
        );
        authService.navigateBasedOnUserStatus(userStatus);
      }
    } catch (error: any) {
      console.log("error attempting to login", error);

      if (error.message === "Invalid session token") {
        await authService.logout();
      }
      hideLoading();
    }
    hideLoading();
  };

  const handleLogin = async () => {
    showLoading();
    let loginResponse = null;
    let userStatus;

    try {
      loginResponse = await authService.loginWithGoogle();
      if (loginResponse.success) {
        userStatus = await authService.getUserStatus(loginResponse.user!);
        updateCurrentUserData(
          loginResponse.user!.get("firstName"),
          loginResponse.user!.get("lastName"),
          loginResponse.user!.get("email"),
          loginResponse.user!.get("profileUrl")
        );

        authService.navigateBasedOnUserStatus(userStatus);
      }
    } catch (error: any) {
      console.log("error", error.message);
    }

    hideLoading();
  };

  return {
    performLogout,
    attemptToLogin,
    handleLogin,
    // Add other auth-related functions here as needed
  };
};
