import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import { Text } from "@/components/Themed";
import { horizontalScale, moderateScale } from "@/utilities/TrueScale";

import { Portal } from "react-native-paper";

import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { memo } from "react";
import MiniplayerContents from "./MiniplayerContents";

type MiniMusicPlayerProps = {
  bottomOffset: number;
  isVisibleSV: SharedValue<boolean>;
};

export function MiniMusicPlayer({
  bottomOffset,
  isVisibleSV,
}: MiniMusicPlayerProps) {
  const miniplayerStyleSV = useAnimatedStyle(() => {
    return {
      opacity: isVisibleSV.value ? 1 : 0,
      pointerEvents: isVisibleSV.value ? "auto" : "none",
    };
  });

  return (
    <Portal>
      <Animated.View
        style={[
          styles.MiniMusicPlayer,
          {
            bottom:
              bottomOffset > 90 && Platform.OS === "android"
                ? 49
                : bottomOffset,
          },
          miniplayerStyleSV,
        ]}
      >
        <MiniplayerContents />
      </Animated.View>
    </Portal>
  );
}

export default memo(MiniMusicPlayer, (prev, next) => {
  return true;
});
const styles = StyleSheet.create({
  MiniMusicPlayer: {
    width: "100%",
    height: "7.5%",
    position: "absolute",
    left: 0,
    // zIndex: 1000,
  },
});
