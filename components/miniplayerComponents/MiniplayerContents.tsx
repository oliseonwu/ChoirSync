import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { memo, useCallback, useMemo } from "react";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import PauseIcon from "@/assets/images/SVG/Pause.svg";
import PlayIcon from "@/assets/images/SVG/Play.svg";
import SmallMusicClipArt from "@/assets/images/SVG/Small music clip art.svg";
import { useCurrentTrack } from "@/contexts/CurrentTrackContext";
import { useNowPlayingContext } from "@/contexts/NowPlayingContext";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
const MemoizedPauseIcon = (
  <PauseIcon width={verticalScale(30)} height={verticalScale(30)} />
);
const MemoizedPlayIcon = (
  <PlayIcon width={verticalScale(30)} height={verticalScale(30)} />
);
const MemoizedSmallMusicClipArt = (
  <SmallMusicClipArt width={verticalScale(52)} height={verticalScale(52)} />
);
export default function MiniplayerContents() {
  const {
    currentTrackDetails,
    currentTrackState,
    currentSongDetailsSV,
    togglePlay,
  } = useCurrentTrack();
  const { openPlayer } = useNowPlayingContext();

  const handlePress = useCallback(() => {
    if (currentTrackState === "paused") {
      openPlayer();
      togglePlay();
    }
  }, []);

  const showPlayIcon = useAnimatedStyle(() => {
    return {
      opacity: currentSongDetailsSV.value.state === "paused" ? 1 : 0,
    };
  });

  const showPauseIcon = useAnimatedStyle(() => {
    return {
      opacity: currentSongDetailsSV.value.state === "playing" ? 1 : 0,
    };
  });

  const displayPauseAndPlayIcons = useMemo(() => {
    return (
      <View
        style={{
          position: "relative",
          width: moderateScale(25),
          height: moderateScale(25),
        }}
      >
        <Animated.View
          style={[
            showPauseIcon,
            {
              position: "absolute",
            },
          ]}
        >
          {MemoizedPauseIcon}
        </Animated.View>
        <Animated.View
          style={[
            showPlayIcon,
            {
              position: "absolute",
            },
          ]}
        >
          {MemoizedPlayIcon}
        </Animated.View>
      </View>
    );
  }, []);

  return (
    <TouchableOpacity
      style={styles.MiniMusicPlayerContent}
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={currentTrackDetails.songId === ""}
    >
      {MemoizedSmallMusicClipArt}

      <View style={styles.MusicDetailsContainer}>
        <Text style={styles.MusicName}>{currentTrackDetails.songName}</Text>
        <Text style={styles.MusicArtist}>{currentTrackDetails.artistName}</Text>
      </View>

      {displayPauseAndPlayIcons}
      {/* <View
        style={{
          position: "relative",
          width: moderateScale(25),
          height: moderateScale(25),
        }}
      >
        {currentTrackState === "playing" ? MemoizedPauseIcon : MemoizedPlayIcon}
      </View> */}
    </TouchableOpacity>
  );
}

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
