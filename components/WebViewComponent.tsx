import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text } from "@/components/Themed";
import React, { memo, useMemo } from "react";
import { Portal } from "react-native-paper";
import Constants from "expo-constants";
import ArrownDown from "@/assets/images/SVG/down-arrow.svg";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useWebView } from "@/contexts/WebViewContext";
import { WebView } from "react-native-webview";

interface WebViewComponentProps {
  title: string;
  url: string;
}

export function WebViewComponent({ title, url }: WebViewComponentProps) {
  const { yOffsetSV, closeWebView } = useWebView();

  const translateYStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: yOffsetSV.value }],
  }));

  const ArrownDownMemoized = useMemo(
    () => (
      <ArrownDown
        height={verticalScale(25)}
        width={horizontalScale(22)}
        fill={"#313234"}
      />
    ),
    []
  );

  return (
    <Portal>
      <Animated.View style={[styles.container, translateYStyle]}>
        <View style={styles.statusBar} />
        <View
          style={[
            styles.headingContainer,
            {
              paddingVertical: verticalScale(10),
            },
          ]}
        >
          <TouchableOpacity onPress={closeWebView}>
            {ArrownDownMemoized}
          </TouchableOpacity>

          <Text style={styles.headingText}>{title}</Text>
          <View style={styles.placeholder} />
        </View>

        {url.includes("https://") ? (
          <WebView source={{ uri: url }} style={styles.webview} />
        ) : (
          <Text>Invalid URL</Text>
        )}
      </Animated.View>
    </Portal>
  );
}

export default memo(WebViewComponent, (prevProps, nextProps) => {
  return prevProps.title === nextProps.title && prevProps.url === nextProps.url;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  statusBar: {
    height: Constants.statusBarHeight,
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: horizontalScale(30),
  },
  headingText: {
    fontFamily: "Inter-Medium",
    color: "#868686",
    fontSize: moderateScale(14),
  },
  webview: {
    flex: 1,
  },
  placeholder: {
    width: horizontalScale(22),
  },
});
