import { StyleSheet, View, Alert, TouchableOpacity } from "react-native";
import { Text } from "@/components/Themed";
import { FlashList } from "@shopify/flash-list";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import { router } from "expo-router";
import { authService } from "@/services/AuthService";
import { useState, useMemo } from "react";
import { SettingsItem } from "@/components/SettingsItem";
import NotificationSettingsIcon from "@/assets/images/SVG/notification-settings-icon.svg";
import ProfileSettingsIcon from "@/assets/images/SVG/profile-settings-icon.svg";
import PrivacySettingsIcon from "@/assets/images/SVG/Pravacy-settings-Icon.svg";
import TermsSettingsIcon from "@/assets/images/SVG/terms-settings-icon.svg";
import { useCurrentTrack } from "@/contexts/CurrentTrackContext";
import { useRecordings } from "@/contexts/RecordingsContext";
import { useLoadingState } from "@/hooks/useLoadingState";
import { useLoading } from "@/contexts/LoadingContext";

type SettingItem = {
  id: string;
  Icon: React.ElementType;
  title: string;
  onPress?: () => void;
};

export default function SettingsScreen() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { opacity, showLoading, hideLoading } = useLoading();
  const { resetCurrentTrack } = useCurrentTrack();
  const { resetRecordings } = useRecordings();

  const performLogout = async () => {
    try {
      showLoading();
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

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: performLogout,
      },
    ]);
  };

  const settingsData = useMemo<SettingItem[]>(
    () => [
      {
        id: "1",
        Icon: ProfileSettingsIcon,
        title: "Profile",
        onPress: () => {},
      },
      {
        id: "2",
        Icon: NotificationSettingsIcon,
        title: "Notifications",
        onPress: () => {},
      },
      {
        id: "3",
        Icon: PrivacySettingsIcon,
        title: "Privacy",
        onPress: () => {},
      },
      {
        id: "4",
        Icon: TermsSettingsIcon,
        title: "Terms and Conditions",
        onPress: () => {},
      },
    ],
    []
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: SettingItem;
    index: number;
  }) => (
    <SettingsItem
      Icon={item.Icon}
      title={item.title}
      onPress={item.onPress}
      isLast={index === settingsData.length - 1}
      isFirst={index === 0}
    />
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={settingsData}
        renderItem={renderItem}
        estimatedItemSize={65}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity style={[styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(40),
  },
  flashListContainer: {
    borderBottomWidth: verticalScale(0.5),
    borderColor: "#EBEBEB",
    backgroundColor: "red",
  },
  logoutButton: {
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    // marginTop: "auto",
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
