import { StyleSheet, TouchableOpacity, View, Alert } from "react-native";
import { Text } from "@/components/Themed";
import {
  moderateScale,
  verticalScale,
  horizontalScale,
} from "@/utilities/TrueScale";
import { router } from "expo-router";
import { authService } from "@/services/AuthService";
import { useState } from "react";
import { StackActions, useNavigation } from "@react-navigation/native";
import RightArrow from "@/assets/images/SVG/right-arrow3.svg";
import { useMusicPlayerVisibility } from "@/hooks/useMusicPlayerVisibility";

export default function SettingsScreen() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  // useMusicPlayerVisibility();
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const result = await authService.logout();

      if (result.success) {
        router.dismissAll();
        // router.replace("/login");
      } else {
        Alert.alert("Error", "Failed to logout");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Account</Text>

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.settingItem}
        // onPress={() => router.push("/accountSettings")}
      >
        <Text style={styles.settingText}>Account Settings</Text>
        <RightArrow
          width={moderateScale(21)}
          height={moderateScale(21)}
          fill={"#313234"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.logoutButton, { opacity: isLoggingOut ? 0.5 : 1 }]}
        onPress={handleLogout}
        disabled={isLoggingOut}
      >
        <Text style={styles.logoutText}>LogOut</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: horizontalScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(14),
    fontFamily: "Inter-SemiBold",
    color: "#8F8F8F",
    marginTop: verticalScale(24),
    marginBottom: verticalScale(14),
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: moderateScale(18),
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(0.5),
    borderColor: "#EBEBEB",
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  settingText: {
    fontSize: moderateScale(16),
    fontFamily: "Inter-Medium",
    color: "#313234",
  },
  logoutButton: {
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    marginTop: "auto",
    marginBottom: verticalScale(61),
    alignItems: "center",
    borderWidth: moderateScale(0.5),
    borderColor: "#EBEBEB",
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  logoutText: {
    fontSize: moderateScale(16),
    fontFamily: "Inter-Medium",
    color: "#FF3B30",
  },
});
