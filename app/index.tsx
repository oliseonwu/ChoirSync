import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { Image } from "expo-image";
import LandingPageImage from "../assets/images/landing-Page.png";
import { useNavigation, router } from "expo-router";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import { StatusBar } from "expo-status-bar";
import SignInWithGoogleBtn from "@/assets/images/SVG/sign-in-with-google.svg";
import { googleAuthService } from "@/services/GoogleAuthService";
import { authService, UserStatus } from "@/services/AuthService";
import Parse from "../services/Parse";
import { LoadingScreenComponent } from "@/components/LoadingScreenComponent";
import { useLoading } from "@/contexts/LoadingContext";
import { useUser } from "@/contexts/UserContext";

export default function LandingPage() {
  const { showLoading, hideLoading } = useLoading();
  const { updateCurrentUserData } = useUser();
  useEffect(() => {
    // Configure the google auth service
    googleAuthService.configure();
    attemptToLogin();
  }, []);

  const attemptToLogin = async () => {
    showLoading();
    const currentUser = await authService.getCurrentUser();
    let userStatus: UserStatus;

    try {
      if (currentUser) {
        userStatus = await authService.getUserStatus(currentUser);
        updateCurrentUserData(
          currentUser.get("firstName"),
          currentUser.get("lastName"),
          currentUser.get("email"),
          currentUser.get("profileUrl")
        );
        authService.navigateBasedOnUserStatus(userStatus);
      }
    } catch (error: any) {
      console.log("error", error);

      if (error.message === "Invalid session token") {
        await authService.logout();
      }
    }
    hideLoading();
  };

  const handleLogin = async () => {
    showLoading();
    let loginResponse = null;
    let userStatus;

    try {
      loginResponse = await authService.loginWithGoogle();
      if (loginResponse.success) {
        userStatus = await authService.getUserStatus(loginResponse.user!);
        updateCurrentUserData(
          loginResponse.user!.get("firstName"),
          loginResponse.user!.get("lastName"),
          loginResponse.user!.get("email"),
          loginResponse.user!.get("profileUrl")
        );

        authService.navigateBasedOnUserStatus(userStatus);
      }
    } catch (error) {
      console.log("error", error);
    }

    hideLoading();
  };

  return (
    <View style={styles.MainContainer}>
      <StatusBar style="light" />

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

        {/* <View style={styles.BtnRowContainer}>
          <TouchableOpacity
            style={[styles.Btn, styles.btnHollow]}
            onPress={handleLogin}
          >
            <Text style={[styles.btnText, { color: "#313234" }]}>Login</Text>
          </TouchableOpacity>

          <View style={styles.HorizontalSpaceView}></View>

          <TouchableOpacity
            style={[styles.Btn, styles.BtnBlack]}
            onPress={() => router.navigate("/signUp/signUpOptions")}
          >
            <Text style={[styles.btnText, { color: "#ffff" }]}>
              Get Started
            </Text>
          </TouchableOpacity>
        </View> */}
        <TouchableOpacity
          style={styles.googleBtnContainer}
          onPress={handleLogin}
        >
          <SignInWithGoogleBtn
            width={horizontalScale(230)}
            height={verticalScale(55)}
          />
        </TouchableOpacity>
      </View>
      <LoadingScreenComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    backgroundColor: "#F9F7F7",

    flex: 1,
  },
  TopContainer: {
    flex: 7,
  },

  LandingPageImage: {
    width: "100%",
    height: "100%",
  },
  BottomContainer: {
    flex: 5,
    justifyContent: "center",
    marginHorizontal: horizontalScale(21),
    // paddingBottom: verticalScale(10),
  },
  Heading1: {
    fontFamily: "Inter-Medium",
    fontSize: moderateScale(32),
    color: "#313234",
    marginBottom: "5%",
  },
  Heading2: {
    fontFamily: "Inter-Regular",
    fontSize: moderateScale(16),
    color: "#525355",
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
  googleBtnContainer: {
    marginTop: "11%",
    marginBottom: "1%",
    alignItems: "center",
  },
});
