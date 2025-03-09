import { useEffect, useState, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export interface PushNotificationState {
  notification: Notifications.Notification; // Return the notification its self
  expoPushToken: Notifications.ExpoPushToken; //  Expo Push Notifications for debuging
}

export const usePushNotifications = (): PushNotificationState => {
  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >(undefined);
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  // Listeners for notifications
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // SETUP PERMISSIONS AND GET TOKEN
    registerForPushNotifications().then((token) => {
      setExpoPushToken(token);
    });

    //  setup listeners for notifications
    // Alert when a notification is received (when app is running)
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    //  Alert when a notification is pressed (when app is closed/opened)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification pressed", response);
      });

    //  Cleanup listeners
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      );
      Notifications.removeNotificationSubscription(responseListener.current!);
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

  // setup permissions
  // get token for push notifications
  async function registerForPushNotifications() {
    let token;
    if (Device.isDevice) {
      // check if physicaldevice

      //  Get permissions status
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus; // this could change

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      //  Check if permissions are granted
      if (finalStatus !== "granted") {
        alert("Failed to get push notification permissions token");
        return;
      }

      // Returns an Expo token that can be used
      // to send a push notification to the device
      // using Expo's push notifications service
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

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
    } else {
      console.log("Error: Please use a physical device");
    }
  }

  return {
    expoPushToken: expoPushToken!,
    notification: notification!,
  };
};
