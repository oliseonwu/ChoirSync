import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image } from "expo-image";
import LandingPageImage from "../assets/images/landing-Page.png";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import SignInWithGoogleBtn from "@/assets/images/SVG/sign-in-with-google.svg";
import { googleAuthService } from "@/services/GoogleAuthService";

import { LoadingScreenComponent } from "@/components/LoadingScreenComponent";
import LoadingButton from "@/components/LoadingButton";

import { useAuth } from "@/hooks/useAuth";
import { StatusBar } from "expo-status-bar";
import { useBottomSheet } from "@/contexts/ButtomSheetContext";
import BottomSheet from "@/components/BottomSheet";
import LoginBottomSheet from "@/components/LoginBottomSheet";

export default function LandingPage() {
  const { attemptToLogin } = useAuth();
  const { open, close } = useBottomSheet();
  useEffect(() => {
    // Configure the google auth service
    googleAuthService.configure();
    attemptToLogin();
  }, []);

  const content = useMemo(() => {
    return (
      <>
        <View style={styles.TopContainer}>
          <Image
            style={styles.LandingPageImage}
            source={LandingPageImage}
            contentFit="cover"
            cachePolicy="memory-disk"
            priority="high"
            transition={0}
          />
        </View>
        <View style={styles.BottomContainer}>
          <Text style={styles.Heading1}>
            {"Organise and share\nchoir recording."}
          </Text>
          <Text style={styles.Heading2}>
            {"This app is designed for choir groups, providing easy" +
              " access to rehearsal recordings for their choir members."}
          </Text>
          {/* {SignInWithGoogleBtnMemoized} */}
          <LoadingButton
            isLoading={false}
            buttonText="Get Started"
            onPress={() => open()}
            style={styles.getStartedButton}
            textStyle={styles.getStartedButtonText}
            backgroundColor="#313234"
          />
        </View>

        <LoadingScreenComponent />
      </>
    );
  }, []);

  return (
    <View style={styles.MainContainer}>
      <BottomSheet>
        <LoginBottomSheet dismissBottomSheet={close} />
      </BottomSheet>
      <StatusBar style="light" />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    backgroundColor: "#F9F7F7",

    flex: 1,
  },
  TopContainer: {
    flexBasis: "59.6%",
    flexShrink: 1, // If the screen is small, the image will shrink
  },

  LandingPageImage: {
    width: "100%",
    height: "100%",
  },
  BottomContainer: {
    paddingTop: "11%",
    marginHorizontal: horizontalScale(21),
  },
  Heading1: {
    fontFamily: "Inter-Medium",
    fontSize: moderateScale(32),
    color: "#313234",
    marginBottom: "4%",
  },
  Heading2: {
    fontFamily: "Inter-Regular",
    fontSize: moderateScale(16),
    color: "#525355",
  },
  flexContainer: {
    flex: 1,
  },
  BtnRowContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: "10%",
    backgroundColor: "red",
  },
  Btn: {
    flex: 1,
    padding: moderateScale(20),
    // padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
  },
  BtnBlack: {
    backgroundColor: "#313234",
  },
  HorizontalSpaceView: {
    width: horizontalScale(15.26),
  },

  btnHollow: {
    borderColor: "#313234",
    borderWidth: 1,
  },
  btnText: {
    color: "#ffff",
    fontFamily: "Inter-SemiBold",
    fontSize: moderateScale(16),
  },

  getStartedButton: {
    marginTop: "14%",
    marginBottom: "16%",

    paddingVertical: verticalScale(15),
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
  },
  getStartedButtonText: {
    color: "#FFFFFF",
    fontFamily: "Inter-Medium",
    fontSize: moderateScale(16),
  },
});
