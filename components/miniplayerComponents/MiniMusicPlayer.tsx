import { StyleSheet, Platform } from "react-native";

import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { memo } from "react";
import MiniplayerContents from "./MiniplayerContents";

type MiniMusicPlayerProps = {
  bottomOffset: number;
};

function MiniMusicPlayer({ bottomOffset }: MiniMusicPlayerProps) {
  return (
    <Animated.View
      style={[
        styles.MiniMusicPlayer,
        {
          bottom: bottomOffset,
        },
      ]}
    >
      <MiniplayerContents />
    </Animated.View>
  );
}

export default memo(MiniMusicPlayer, (prev, next) => {
  return true;
});
const styles = StyleSheet.create({
  MiniMusicPlayer: {
    width: "100%",
    height: "7.5%",
    zIndex: 0,
  },
});
