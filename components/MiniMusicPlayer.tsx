import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import { Text } from "@/components/Themed";
import {
  verticalScale,
  horizontalScale,
  moderateScale,
} from "@/utilities/TrueScale";

import SmallMusicClipArt from "@/assets/images/SVG/Small music clip art.svg";
import PauseIcon from "@/assets/images/SVG/Pause.svg";
import PlayIcon from "@/assets/images/SVG/Play.svg";
import { Portal } from "react-native-paper";
import { useCurrentTrack } from "@/contexts/CurrentTrackContext";
import { useNowPlayingContext } from "@/contexts/NowPlayingContext";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { memo } from "react";

type MiniMusicPlayerProps = {
  bottomOffset: number;
  isVisibleSV: SharedValue<boolean>;
};

export function MiniMusicPlayer({
  bottomOffset,
  isVisibleSV,
}: MiniMusicPlayerProps) {
  const { currentTrackDetails, togglePlay, currentTrackState } =
    useCurrentTrack();
  const { openPlayer } = useNowPlayingContext();

  const miniplayerStyleSV = useAnimatedStyle(() => {
    return {
      opacity: isVisibleSV.value ? 1 : 0,
      pointerEvents: isVisibleSV.value ? "auto" : "none",
    };
  });

  const handlePress = () => {
    if (currentTrackState === "paused") {
      openPlayer();
      togglePlay();
    }
  };
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
        <TouchableOpacity
          style={styles.MiniMusicPlayerContent}
          activeOpacity={0.8}
          onPress={handlePress}
        >
          <SmallMusicClipArt
            width={verticalScale(52)}
            height={verticalScale(52)}
          />

          <View style={styles.MusicDetailsContainer}>
            <Text style={styles.MusicName}>{currentTrackDetails.songName}</Text>
            <Text style={styles.MusicArtist}>
              {currentTrackDetails.artistName}
            </Text>
          </View>

          <View>
            {currentTrackState === "playing" ? (
              <PauseIcon width={verticalScale(30)} height={verticalScale(30)} />
            ) : (
              <PlayIcon width={verticalScale(30)} height={verticalScale(30)} />
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Portal>
  );
}

export default memo(MiniMusicPlayer, (prev, next) => {
  return (
    prev.bottomOffset === next.bottomOffset &&
    prev.isVisibleSV === next.isVisibleSV
  );
});
const styles = StyleSheet.create({
  MiniMusicPlayer: {
    width: "100%",
    height: "7.5%",
    position: "absolute",
    left: 0,
    // zIndex: 1000,
  },
  MiniMusicPlayerContent: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: horizontalScale(12),
    paddingRight: horizontalScale(30),
    // backgroundColor: "rgba(0, 0, 0, 0)",
    backgroundColor: "#A3A2A2",
    alignItems: "center",
  },
  MusicDetailsContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
    alignItems: "center",
  },
  MusicName: {
    fontSize: moderateScale(16),
    fontFamily: "Inter-Medium",
    color: "#F9F7F7",
  },
  MusicArtist: {
    fontSize: moderateScale(12),
    fontFamily: "Inter-Medium",
    color: "#F9F7F7",
    opacity: 0.5,
  },
});
