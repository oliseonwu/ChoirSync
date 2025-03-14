import { useRef } from "react";
import { Platform } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";

import { StyleSheet, View } from "react-native";
import React from "react";
import { verticalScale } from "@/utilities/TrueScale";

export default function AdComponent() {
  const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy";
  const adUnitIdRealTest = "ca-app-pub-3940256099942544/2435281174";
  const bannerRef = useRef<BannerAd>(null);

  // (iOS) WKWebView can terminate if app is in a "suspended state", resulting in an empty banner when app returns to foreground.
  // Therefore it's advised to "manually" request a new ad when the app is foregrounded (https://groups.google.com/g/google-admob-ads-sdk/c/rwBpqOUr8m8).
  useForeground(() => {
    Platform.OS === "ios" && bannerRef.current?.load();
  });

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "#F3F2F2",
        // backgroundColor: "#A3A2A2",
        // backgroundColor: "#FAFAFA",
        // backgroundColor: "#1e81b0",
        paddingVertical: verticalScale(6),
        borderBottomWidth: 1,
        borderBottomColor: "#E6E9E8",
      }}
    >
      <BannerAd
        ref={bannerRef}
        unitId={adUnitIdRealTest}
        size={BannerAdSize.BANNER}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
