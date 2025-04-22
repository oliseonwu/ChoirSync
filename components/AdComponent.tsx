import { memo, useEffect, useRef, useState } from "react";
import { Platform, Text } from "react-native";
import {
  AdsConsent,
  AdsConsentStatus,
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";

import { StyleSheet, View } from "react-native";
import React from "react";
import { moderateScale, verticalScale } from "@/utilities/TrueScale";
import { SkeletonLoader } from "./SkeletonLoader";
import AdItem from "./skeletonItems/AdItem";
type AdComponentProps = {
  paddingVertical?: number;
  paddingHorizontal?: number;
  borderRadius?: number;
  borderLeftWidth?: number;
  borderRightWidth?: number;
  borderTopWidth?: number;
  borderBottomWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
};

const AdComponent: React.FC<AdComponentProps> = ({
  paddingVertical = verticalScale(8),
  borderRadius = 0,
  borderLeftWidth = 0,
  borderRightWidth = 0,
  borderTopWidth = 0,
  borderBottomWidth = moderateScale(0.5),
  borderColor = "#E6E9E8",
  backgroundColor = "#FAFAFA",
}) => {
  const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : Platform.OS === "ios"
      ? `${process.env.EXPO_PUBLIC_ADMOB_BANNER_ID_IOS}`
      : `${process.env.EXPO_PUBLIC_ADMOB_BANNER_ID_ANDROID}`;
  // const adUnitId = TestIds.ADAPTIVE_BANNER;
  const bannerRef = useRef<BannerAd>(null);
  const [canShowAds, setCanShowAds] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  // (iOS) WKWebView can terminate if app is in a "suspended state", resulting in an empty banner when app returns to foreground.
  // Therefore it's advised to "manually" request a new ad when the app is foregrounded (https://groups.google.com/g/google-admob-ads-sdk/c/rwBpqOUr8m8).
  useForeground(() => {
    Platform.OS === "ios" && canShowAds && bannerRef.current?.load();
  });

  useEffect(() => {
    canShowAdsHelper();
  }, []);

  async function canShowAdsHelper() {
    const { storeAndAccessInformationOnDevice } =
      await AdsConsent.getUserChoices();
    const { status: consentStatus } = await AdsConsent.getConsentInfo();

    // Google Mobile Ads SDK won't show any ads if the user didn't give
    // consent to store and/or access information on the device.
    // Also to know if the user is in EEA or not I check the consentStatus.
    // if UMP concent is NOT_REQUIRED, then the user is not in EEA.
    // if user is not in EAA then checking storeAndAccessInformationOnDevice is
    // not needed.

    const canShowAds =
      storeAndAccessInformationOnDevice ||
      consentStatus === AdsConsentStatus.NOT_REQUIRED;

    setCanShowAds(canShowAds);
    setStatus(consentStatus);
  }

  if (!canShowAds) return null;

  return (
    <View
      style={[
        styles.container,
        {
          paddingVertical,
          borderRadius,
          borderLeftWidth,
          borderRightWidth,
          borderTopWidth,
          borderBottomWidth,
          borderColor,
          backgroundColor,
        },
      ]}
    >
      <View style={[styles.adWrapper]}>
        <BannerAd
          ref={bannerRef}
          unitId={adUnitId}
          size={BannerAdSize.BANNER}
          onAdLoaded={() => {
            setIsAdLoaded(true);
          }}
        />
      </View>

      <View style={{ position: "absolute", opacity: isAdLoaded ? 0 : 1 }}>
        <SkeletonLoader skelectonItem={<AdItem />} />
      </View>
    </View>
  );
};

export default memo(AdComponent, (prevProps, nextProps) => {
  return true;
});

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",

    paddingVertical: verticalScale(8),
    borderBottomWidth: 0.5,
    borderBottomColor: "#E6E9E8",
    backgroundColor: "#FAFAFA",
    position: "relative",
  },
  adWrapper: {
    width: 320,
    height: 50,
  },
});
