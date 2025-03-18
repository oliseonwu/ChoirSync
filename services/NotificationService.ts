import AsyncStorageService, { AsyncStorageKeys } from "./AsyncStorageService";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { ExpoPushToken } from "expo-notifications";
import Constants from "expo-constants";
import Parse from "./Parse";
import { Linking, Platform } from "react-native";

//  Handles Notification related services like storage
// and deletion of push notification tokens and updating
//  the notification settings.
class NotificationService {
  async storePushNotificationToken(token: string) {
    try {
      const result = await Parse.Cloud.run("storePushToken", { token });

      // store in AsyncStorage
      await AsyncStorageService.setItem(AsyncStorageKeys.PUSH_TOKEN, token);
      return result;
    } catch (error: any) {
      console.log("error", error);
      return error;
    }
  }
  /**
   * Deletes the push notification token from the DB and AsyncStorage
   * @param token - The push notification token
   * @returns void
   */
  async deletePushNotificationToken(token: string) {
    if (!token) {
      return;
    }

    try {
      const result = await Parse.Cloud.run("deletePushToken", { token });
      // delete from AsyncStorage
      await AsyncStorageService.removeItem(AsyncStorageKeys.PUSH_TOKEN);
      return result;
    } catch (error: any) {
      return error;
    }
  }
  /**
   * Checks if the notification is enabled
   * @returns boolean
   */
  async isNotificationEnabled() {
    const { status: systemNotificationSetting } =
      await Notifications.getPermissionsAsync();

    return systemNotificationSetting === "granted";
  }
  /**
   * Updates the notification settings of the app by updating the notification
   * setting in AsyncStorage and the DB
   * @param systemNotificationSetting - The new notification settings
   * @returns void
   */
  async updateNotificationSettings(systemNotificationSetting: string) {
    let token;
    let previousNotificationStatus = await AsyncStorageService.getItem(
      AsyncStorageKeys.NOTIFICATION_STATUS
    );
    let previousPushToken = await AsyncStorageService.getItem(
      AsyncStorageKeys.PUSH_TOKEN
    );

    if (previousNotificationStatus === systemNotificationSetting) {
      return;
    }

    if (systemNotificationSetting === "granted") {
      // save the push token to the DB
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      await this.storePushNotificationToken(token.data);

      // reset the dialog flag
      await AsyncStorageService.removeItem(
        AsyncStorageKeys.HAS_SEEN_NOTIFICATION_PERMISSIONS_DIALOG
      );
    } else {
      // delete the push token from the DB\
      if (previousPushToken) {
        await this.deletePushNotificationToken(previousPushToken);
      }
    }

    // save the notification status to AsyncStorage
    await AsyncStorageService.setItem(
      AsyncStorageKeys.NOTIFICATION_STATUS,
      systemNotificationSetting
    );
  }

  /**
   * Opens the notification system settings of the app
   * @returns void
   */
  async openNotificationSystemSettings() {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  }
}

export const notificationService = new NotificationService();
