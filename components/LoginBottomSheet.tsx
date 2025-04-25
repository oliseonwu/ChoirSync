import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Linking,
} from "react-native";
import React, { Component, useCallback } from "react";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import Logo from "@/assets/images/SVG/logo.svg";
import AppleIcon from "@/assets/images/SVG/apple.svg";
import GoogleIcon from "@/assets/images/SVG/google.svg";
import { useAuth } from "@/hooks/useAuth";

import EnvelopeIcon from "@/assets/images/SVG/envelope.svg";
import GmailIconColored from "@/assets/images/SVG/google-colored.svg";
import SocialButton from "./SocialButton";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";

// Terms of Service and Privacy Policy URLs
const TERMS_URL = "https://choirsync.info/terms";
const PRIVACY_URL = "https://choirsync.info/privacy";

export default function LoginBottomSheet({
  dismissBottomSheet,
}: {
  dismissBottomSheet: () => void;
}) {
  const { performLogin } = useAuth();

  const onAppleButtonPress = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dismissBottomSheet();
    await performLogin("apple");
  }, []);

  const onGoogleButtonPress = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dismissBottomSheet();
    await performLogin("google");
  }, []);

  // Function to handle opening URLs
  const openURL = useCallback((url: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log(`Cannot open URL: ${url}`);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textContent}>
        <Text style={styles.subText}>
          Register for a free account to get started with ChoirSync. Access all
          choir files in one place.
        </Text>
      </View>

      <SocialButton
        Icon={EnvelopeIcon}
        label="Continue with Email"
        onPress={() => {
          dismissBottomSheet();
          router.navigate("/email");
        }}
      />

      <SocialButton
        Icon={GmailIconColored}
        label="Continue with Gmail"
        buttonStyle={{ marginTop: verticalScale(10) }}
        onPress={() => {
          dismissBottomSheet();
          onGoogleButtonPress();
        }}
        visible={Platform.OS === "android"}
      />

      <View style={styles.HorizontalGroup}>
        <SocialButton
          Icon={AppleIcon}
          label=""
          buttonStyle={styles.socialButton}
          iconColor="#F4F4F4"
          onPress={onAppleButtonPress}
          visible={Platform.OS === "ios"}
        />

        <SocialButton
          Icon={GoogleIcon}
          label=""
          buttonStyle={styles.socialButton}
          iconColor="#F4F4F4"
          onPress={onGoogleButtonPress}
          visible={Platform.OS === "ios"}
        />
      </View>

      <Text style={styles.footerText}>
        By continuing, you agree to our{" "}
        <Text style={styles.footerTextLink} onPress={() => openURL(TERMS_URL)}>
          Terms of Service
        </Text>{" "}
        and{" "}
        <Text
          style={styles.footerTextLink}
          onPress={() => openURL(PRIVACY_URL)}
        >
          Privacy Policy
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "5%",
  },

  textContent: {
    marginTop: "5%",
    flex: 1,
    maxHeight: verticalScale(100),
  },

  subText: {
    fontSize: moderateScale(15),
    fontFamily: "Inter-Regular",
    color: "#313234",
    letterSpacing: 0.2,
    lineHeight: verticalScale(20),
    marginBottom: "5%",
  },
  button: {
    borderRadius: moderateScale(10),
    backgroundColor: "#EAEAEA",
    paddingVertical: verticalScale(15),
  },
  buttonText: {
    fontSize: moderateScale(16),
    fontFamily: "Inter-Medium",
    textAlign: "center",
    color: "#313234",
  },

  buttonDark: {
    backgroundColor: "#373939",
  },
  buttonDarkText: {
    color: "#F4F4F4",
  },
  HorizontalGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: verticalScale(16),
    gap: horizontalScale(8),
  },
  socialButton: {
    borderRadius: moderateScale(10),
    backgroundColor: "#373939",
    paddingVertical: verticalScale(15),
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: moderateScale(12),
    fontFamily: "Inter-Regular",
    color: "#313234",
    marginTop: "6%",
    justifyContent: "flex-end",
  },
  footerTextLink: {
    color: "#313234",
    textDecorationLine: "underline",
  },
});
