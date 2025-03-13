import {
  AppStateStatus,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import { getWindowSize } from "@/utilities/TrueScale";
import { useAppState } from "@/contexts/AppStateContext";
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";
import { EventRegister } from "react-native-event-listeners";
import { AutomaticSwitch } from "./AutomaticSwitch";
import { notificationService } from "@/services/NotificationService";

interface NotificationMenuItemProps {
  label: string;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  borderBottomWidth?: number;
}

export function NotificationMenuItem({
  label,
  onValueChange,
  disabled = false,
  borderBottomWidth = 0,
}: NotificationMenuItemProps) {
  const isNotificationEnabledSV = useSharedValue(true);
  useEffect(() => {
    const listener = EventRegister.addEventListener(
      "appStateChange",
      async (data) => {
        if (
          data.nextAppState === "active" &&
          data.previousAppState !== "active"
        ) {
          console.log("appStateChange", data);
          isNotificationEnabledSV.value =
            data.notificationSetting === "granted";
        }
      }
    );
    setIsNotificationEnabled();
    return () => {
      if (typeof listener === "string") {
        EventRegister.removeEventListener(listener);
      }
    };
  }, []);

  const setIsNotificationEnabled = async () => {
    isNotificationEnabledSV.value =
      await notificationService.isNotificationEnabled();
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderBottomWidth: borderBottomWidth, opacity: disabled ? 0.5 : 1 },
      ]}
      onPress={() => {
        notificationService.openNotificationSystemSettings();
      }}
    >
      <Text style={styles.label}>{label}</Text>
      <AutomaticSwitch
        isOn={isNotificationEnabledSV}
        onValueChange={onValueChange}
        disabled={disabled}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: verticalScale(16),
    alignItems: "center",
    borderWidth: moderateScale(0.5),
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: moderateScale(0.5),
    borderColor: "#F7F7F7",
    paddingHorizontal: horizontalScale(10),
  },
  label: {
    flex: 1,
    fontFamily: "Inter-Medium",
    fontSize: moderateScale(16),
    color: "#3E3C48",
  },
});
