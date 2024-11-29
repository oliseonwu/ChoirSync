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

export default function SettingsScreen() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", "Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.sectionTitle}>Account</Text>

      <TouchableOpacity
        style={styles.settingItem}
        // onPress={() => router.push("/accountSettings")}
      >
        <Text style={styles.settingText}>Account Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={isLoggingOut}
      >
        <Text style={styles.logoutText}>LogOut</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: horizontalScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontFamily: "Inter-Regular",
    color: "#8F8F8F",
    marginTop: verticalScale(24),
    marginBottom: verticalScale(8),
  },
  settingItem: {
    backgroundColor: "#FFFFFF",
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
  },
  settingText: {
    fontSize: moderateScale(16),
    fontFamily: "Inter-Regular",
    color: "#000000",
  },
  logoutButton: {
    backgroundColor: "#FFFFFF",
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    marginTop: "auto",
    marginBottom: verticalScale(32),
    alignItems: "center",
  },
  logoutText: {
    fontSize: moderateScale(16),
    fontFamily: "Inter-Regular",
    color: "#FF3B30",
  },
});
