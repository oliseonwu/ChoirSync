import { StyleSheet, View, Switch } from "react-native";
import React, { useState } from "react";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import MenuItemOne from "@/components/MenuItemOne";
// import * as Notifications from "expo-notifications";

export default function NotificationsScreen() {
  const [pushEnabled, setPushEnabled] = useState(false);

  //   const togglePushNotifications = async () => {
  //     const { status: existingStatus } =
  //     //   await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;

  //     if (existingStatus !== "granted") {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }

  //     if (finalStatus === "granted") {
  //       setPushEnabled(true);
  //     } else {
  //       setPushEnabled(false);
  //     }
  //   };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <MenuItemOne
          label="Push Notifications"
          value={pushEnabled ? "On" : "Off"}
          //   onPress={togglePushNotifications}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: verticalScale(40),
  },
  section: {
    paddingHorizontal: horizontalScale(24),
  },
});
