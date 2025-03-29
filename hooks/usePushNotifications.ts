import { useEffect, useState, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Alert, Linking, Platform } from "react-native";
import { notificationService } from "../services/NotificationService";
import AsyncStorageService, {
  AsyncStorageKeys,
} from "@/services/AsyncStorageService";
import { router } from "expo-router";

export interface PushNotificationState {
  notification: Notifications.Notification; // Return the notification its self
  expoPushToken: Notifications.ExpoPushToken; //  Expo Push Notifications for debuging
  registerForPushNotifications: () => Promise<
    Notifications.ExpoPushToken | undefined
  >;
  setupListeners: () => void;
  removeListeners: () => void;
}

export const usePushNotifications = (): PushNotificationState => {
  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >(undefined);
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  // Listeners for notifications
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    //  Cleanup listeners if added
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      );
      Notifications.removeNotificationSubscription(responseListener.current!);
      Notifications.unregisterForNotificationsAsync();
    };
  }, []);

  Notifications.setNotificationHandler({
    //  Handles notifications when app is running
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const displayCustomAlert = async (
    title: string,
    message: string,
    actionText: string,
    actionHandler: () => void
  ) => {
    const hasSeenNotificationPermissionsDialog =
      await AsyncStorageService.getItem(
        AsyncStorageKeys.HAS_SEEN_NOTIFICATION_PERMISSIONS_DIALOG
      );
    if (hasSeenNotificationPermissionsDialog) {
      return;
    }

    Alert.alert(title, message, [
      {
        text: "Cancel",
        style: "cancel",
        onPress: async () => {
          // stop showing the dialog
          await AsyncStorageService.setItem(
            AsyncStorageKeys.HAS_SEEN_NOTIFICATION_PERMISSIONS_DIALOG,
            "true"
          );
        },
      },
      {
        text: actionText,
        onPress: actionHandler,
      },
    ]);
  };

  const setupListeners = () => {
    console.log("settin up listener");

    // Alert when a notification is received (when app is running)
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // // Get the most recent notification response and check if it has a url
    // // If it does, redirect to the url
    // Notifications.getLastNotificationResponseAsync().then(async (response) => {
    //   // if (!response?.notification) {
    //   //   console.log("No notification response");
    //   //   return;
    //   // }
    //   // console.log("Notification received");
    //   // await redirect(response?.notification);
    //   Notifications.clearLastNotificationResponseAsync();
    // });

    //  when a notification is pressed (when app is closed/opened)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          let notificationRefId = response?.notification.request.identifier;
          const storedNotificationRefId = await AsyncStorageService.getItem(
            AsyncStorageKeys.NOTIFICATION_RESPONSE_ID
          );

          if (notificationRefId === storedNotificationRefId) {
            return;
          }

          redirect(response?.notification);

          await AsyncStorageService.setItem(
            AsyncStorageKeys.NOTIFICATION_RESPONSE_ID,
            notificationRefId
          );
        }
      );
    return;
  };

  const removeListeners = () => {
    if (!notificationListener.current || !responseListener.current) {
      return;
    }

    // notificationListener.current.remove();
    // responseListener.current.remove();

    Notifications.removeNotificationSubscription(responseListener.current!);
    Notifications.removeNotificationSubscription(notificationListener.current!);
  };

  async function redirect(notification: Notifications.Notification) {
    const data: { pathname?: string; params?: {} } =
      notification.request.content.data;

    console.log("data", data);
    if (data.pathname) {
      router.push({
        pathname: data.pathname as any,
        params: data.params || {},
      });
    }
  }
  // Get the Expo push token for the device if the user has already granted permissions
  async function initialGetExpoPushToken() {
    let token;
    const { status: systemNotificationSetting } =
      await Notifications.getPermissionsAsync();
    const storedNotificationStatus = await AsyncStorageService.getItem(
      AsyncStorageKeys.NOTIFICATION_STATUS
    );

    if (
      systemNotificationSetting === Notifications.PermissionStatus.GRANTED &&
      storedNotificationStatus === Notifications.PermissionStatus.GRANTED
    ) {
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
    }

    return token;
  }

  // setup permissions
  // get token for push notifications
  async function registerForPushNotifications() {
    let token = await initialGetExpoPushToken();

    if (token) {
      setExpoPushToken(token);
      return;
    }

    if (!Device.isDevice) {
      // check if physicaldevice
      console.log("Error: Please use a physical device");
      return;
    }

    //  Get permissions status
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus; // this could change

    switch (finalStatus) {
      case "denied":
        displayCustomAlert(
          "Enable Notifications",
          "Push notifications are disabled. Would you like to enable them in settings?",
          "Settings",
          notificationService.openNotificationSystemSettings
        );
        return;
      case "undetermined":
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        break;
      default:
        break;
    }

    //  Check if permissions are granted
    if (finalStatus !== "granted") {
      // alert("Failed to get push notification permissions token");
      return;
    }

    // Returns an Expo token that can be used
    // to send a push notification to the device
    // using Expo's push notifications service
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });

    await notificationService.updateNotificationSettings(finalStatus);

    if (Platform.OS === "android") {
      // use to mute certain notification channels
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });

      return token;
    }

    setExpoPushToken(token);
  }

  return {
    expoPushToken: expoPushToken!,
    notification: notification!,
    registerForPushNotifications,
    setupListeners,
    removeListeners,
  };
};
