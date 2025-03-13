import AsyncStorageService, {
  AsyncStorageKeys,
} from "@/services/AsyncStorageService";
import { createContext, useContext, useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import * as Notifications from "expo-notifications";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { notificationService } from "@/services/NotificationService";
import { EventRegister } from "react-native-event-listeners";
type AppStateContextType = {
  appStateSV: SharedValue<AppStateStatus>;
};

const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined
);

// OPTIMIZATION TIP:
// Lets not keep notification logic in the AppStateContext.
// Instead place it in the usePushNotifications hook
// then we can use the AppStateContext to emit events
// to the usePushNotifications hook to sync the
// notification permissions. This way also makes keeping
// track of the stored notification permissions in AsyncStorage
// not needed because the usePushNotifications hook will keep
// track of the notification permissions in the DB using a Ref.
export const AppStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const appStateSV = useSharedValue<AppStateStatus>("unknown");

  const authorizeNotificationSync = async (
    systemNotificationSetting: Notifications.PermissionStatus,
    nextAppState: AppStateStatus,
    currentAppState: AppStateStatus
  ) => {
    // appStateSV.value !== "active" && nextAppState === "active" &&
    let authorized = true;
    const storedNotificationSetting = await AsyncStorageService.getItem(
      AsyncStorageKeys.NOTIFICATION_STATUS
    );

    // We must wait for PushNotifications to be initialized
    // before syncing the Notification permissions. UsePushNotifications hook
    // will update the Notification status flag in AsyncStorage
    //  after it's initialized.

    // Also we only want to sync when the next state is active
    // and the current state is not background

    // we dont want to sync if the stored notification setting is
    // thesame as the system notification setting
    if (
      storedNotificationSetting === null &&
      currentAppState !== "background" &&
      nextAppState !== "active" &&
      systemNotificationSetting === storedNotificationSetting
    ) {
      authorized = false;
    }

    return authorized;
  };

  /**
   * Syncs the notification permissions in the system settings
   * with the stored notification permissions in the app(AsyncStorage)
   * and the DB.
   * @param nextAppState - The next app state
   * @returns The system notification setting
   */
  async function syncNotificationPermissions(nextAppState: AppStateStatus) {
    const { status: systemNotificationSetting } =
      await Notifications.getPermissionsAsync();

    const currentAppState = appStateSV.value;

    const canSync = await authorizeNotificationSync(
      systemNotificationSetting,
      nextAppState,
      currentAppState
    );

    if (canSync) {
      notificationService.updateNotificationSettings(systemNotificationSetting);
    }

    return systemNotificationSetting;
  }

  const onActive = async (nextAppState: AppStateStatus) => {
    const systemNotificationSetting =
      await syncNotificationPermissions(nextAppState);

    EventRegister.emit("appStateChange", {
      nextAppState: nextAppState,
      previousAppState: appStateSV.value,
      notificationSetting: systemNotificationSetting,
    });
  };

  async function onAppStateChange(nextAppState: AppStateStatus) {
    switch (nextAppState) {
      case "active":
        await onActive(nextAppState);
        break;
      default:
        appStateSV.value = nextAppState;
        break;
    }

    appStateSV.value = nextAppState;
  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);
  return (
    <AppStateContext.Provider value={{ appStateSV }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within a AppStateProvider");
  }
  return context;
};
