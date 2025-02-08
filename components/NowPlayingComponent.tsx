import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React, { memo } from "react";
import { Portal } from "react-native-paper";
import Constants from "expo-constants";
import { useHeaderHeight } from "@react-navigation/elements";
import ArrownDown from "@/assets/images/SVG/down-arrow.svg";
import SaveIcon from "@/assets/images/SVG/save-icon.svg";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useNowPlayingContext } from "@/contexts/NowPlayingContext";

export function NowPlayingComponent() {
  const headerAndStatusBarHeight = useHeaderHeight();
  console.log(headerAndStatusBarHeight);
  const headingContainerHeight =
    headerAndStatusBarHeight - Constants.statusBarHeight;
  const { yOffsetSV, closePlayer } = useNowPlayingContext();

  const translateYStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: yOffsetSV.value }],
  }));

  return (
    <Portal>
      <Animated.View style={[styles.container, translateYStyle]}>
        <View style={styles.statusBar}></View>

        <View
          style={[styles.headingContainer, { height: headingContainerHeight }]}
        >
          <TouchableOpacity onPress={closePlayer}>
            <ArrownDown
              height={verticalScale(25)}
              width={horizontalScale(22)}
              fill={"#313234"}
            />
          </TouchableOpacity>

          <Text style={styles.headingText}>NowPlayingComponent</Text>

          <TouchableOpacity>
            <SaveIcon height={verticalScale(25)} width={horizontalScale(22)} />
          </TouchableOpacity>
        </View>
        {/* <Text>NowPlayingComponent</Text> */}
      </Animated.View>
    </Portal>
  );
}
export default memo(NowPlayingComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // pointerEvents: "none",
  },
  statusBar: {
    height: Constants.statusBarHeight,
    backgroundColor: "blue",
  },
  headingContainer: {
    backgroundColor: "pink",
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
});
