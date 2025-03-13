import { StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";

import { notificationService } from "@/services/NotificationService";
import { useFocusEffect } from "expo-router";

import { NotificationMenuItem } from "@/components/NotificationMenuItem";
// import * as Notifications from "expo-notifications";

export default function NotificationsScreen() {
  const togglePushNotifications = async () => {
    notificationService.openNotificationSystemSettings();
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <NotificationMenuItem
          label="Push Notifications"
          borderBottomWidth={1}
          onValueChange={togglePushNotifications}
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
