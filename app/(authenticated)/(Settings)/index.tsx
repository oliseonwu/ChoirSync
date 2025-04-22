import { StyleSheet, View, Alert, TouchableOpacity, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import { router } from "expo-router";
import { authService } from "@/services/AuthService";
import { useState, useMemo, useCallback, memo } from "react";
import { SettingsItem } from "@/components/SettingsItem";
import NotificationSettingsIcon from "@/assets/images/SVG/notification-settings-icon.svg";
import ProfileSettingsIcon from "@/assets/images/SVG/profile-settings-icon.svg";
import PrivacySettingsIcon from "@/assets/images/SVG/privacy-settings-icon.svg";
import TermsSettingsIcon from "@/assets/images/SVG/terms-settings-icon.svg";
import { useCurrentTrack } from "@/contexts/CurrentTrackContext";
import { useRecordings } from "@/contexts/RecordingsContext";
import { useLoadingState } from "@/hooks/useLoadingState";
import { useLoading } from "@/contexts/LoadingContext";
import { useWebView } from "@/contexts/WebViewContext";
import { NowPlayingComponent } from "@/components/NowPlayingComponent";
import { WebViewComponent } from "@/components/WebViewComponent";
import { notificationService } from "@/services/NotificationService";
import { useAuth } from "@/hooks/useAuth";
import AsyncStorageService, {
  AsyncStorageKeys,
} from "@/services/AsyncStorageService";

type SettingItem = {
  id: number;
  Icon: React.ElementType;
  title: string;
  onPress?: () => void;
};

const privacyIconMemo = memo(PrivacySettingsIcon);
const termsIconMemo = memo(TermsSettingsIcon);
const notificationIconMemo = memo(NotificationSettingsIcon);
const profileIconMemo = memo(ProfileSettingsIcon);

export default function SettingsScreen() {
  const { performLogout } = useAuth();
  const [webViewTitle, setWebViewTitle] = useState("");
  const [webViewUrl, setWebViewUrl] = useState(
    "https://oliseonwu.github.io/choirsync.github.io/privacy.html"
  );
  const { showWebView } = useWebView();

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
        id: 1,
        Icon: profileIconMemo,
        title: "Account profile",
        onPress: () => router.push("/(authenticated)/(Settings)/profile"),
      },
      {
        id: 2,
        Icon: notificationIconMemo,
        title: "Notifications",
        onPress: () => router.push("/(authenticated)/(Settings)/notifications"),
      },
      {
        id: 3,
        Icon: privacyIconMemo,
        title: "Privacy",
        onPress: () => {
          setWebViewTitle("Privacy Policy");
          setWebViewUrl("https://choirsync.info/privacy");
          showWebView();
        },
      },
      {
        id: 4,
        Icon: termsIconMemo,
        title: "Terms and Conditions",
        onPress: () => {
          setWebViewTitle("Terms and Conditions");
          setWebViewUrl("https://choirsync.info/terms");
          showWebView();
        },
      },
    ],
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: SettingItem; index: number }) => (
      <SettingsItem
        Icon={item.Icon}
        title={item.title}
        onPress={item.onPress}
        isLast={item.id === settingsData.length}
        isFirst={item.id === 1}
      />
    ),
    []
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={settingsData}
        renderItem={renderItem}
        estimatedItemSize={65}
        scrollEnabled={false}
        keyExtractor={(item) => item.id.toString()}
      />

      <TouchableOpacity style={[styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <WebViewComponent title={webViewTitle} url={webViewUrl} />
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
    borderWidth: verticalScale(1.0),
    borderColor: "#EBEBEB",
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  logoutText: {
    fontSize: moderateScale(16),
    fontFamily: "Inter-Medium",
    color: "#C15141",
  },
});
