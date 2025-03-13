import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { memo, useEffect, useMemo, useState } from "react";
import { Portal } from "react-native-paper";
import Constants from "expo-constants";
import { useHeaderHeight } from "@react-navigation/elements";
import ArrownDown from "@/assets/images/SVG/down-arrow.svg";
import SaveIcon from "@/assets/images/SVG/save-icon.svg";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
  getWindowSize,
} from "@/utilities/TrueScale";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useNowPlayingContext } from "@/contexts/NowPlayingContext";
import { useCurrentTrack } from "@/contexts/CurrentTrackContext";
import YoutubePlayer from "react-native-youtube-iframe";
import SectionDisplay from "./SectionDisplay";

export function NowPlayingComponent() {
  // const headerAndStatusBarHeight = useHeaderHeight();
  // const headingContainerHeight =
  //   headerAndStatusBarHeight - Constants.statusBarHeight;
  const { yOffsetSV, closePlayer } = useNowPlayingContext();
  const {
    togglePlay,
    currentTrackState,
    currentTrackDetails,
    currentSongDetailsSV,
  } = useCurrentTrack();
  const [headingText, setHeadingText] = useState("");
  const [ytVideoId, setYtVideoId] = useState<string | undefined>(undefined);
  const VIDEO_ASPECT_RATIO = 16 / 9;
  const SCREEN_WIDTH = getWindowSize().width;

  useEffect(() => {
    setHeadingText(currentTrackDetails.songName);
    setYtVideoId(getYouTubeVideoId(currentTrackDetails.songUrl));
  }, [currentTrackDetails.songId]);

  const translateYStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: yOffsetSV.value }],
  }));

  function getYouTubeVideoId(url: string): string | undefined {
    const regex =
      /(?:youtu\.be\/|youtube\.com\/(?:.*v=|embed\/|v\/|shorts\/|live\/))([^?&\/]+)/;
    const match = url.match(regex);
    return match ? match[1] : undefined;
  }

  const handleClose = () => {
    if (currentTrackState === "playing") {
      togglePlay();
      closePlayer();
    }
  };

  const SaveIconMemoized = useMemo(
    () => (
      <SaveIcon
        opacity={0.5}
        height={verticalScale(25)}
        width={horizontalScale(22)}
      />
    ),
    []
  );

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
        <View style={styles.statusBar}></View>
        <View
          style={[
            styles.headingContainer,
            {
              paddingVertical: verticalScale(10),
            },
          ]}
        >
          <TouchableOpacity onPress={handleClose}>
            {ArrownDownMemoized}
          </TouchableOpacity>

          <Text style={styles.headingText}>{headingText}</Text>
          <TouchableOpacity disabled={true}>
            {SaveIconMemoized}
          </TouchableOpacity>
        </View>

        <View style={styles.videoPlayerContainer}>
          <YoutubePlayer
            height={SCREEN_WIDTH / VIDEO_ASPECT_RATIO}
            videoId={ytVideoId}
            play={currentTrackState === "playing" && ytVideoId !== undefined}
            webViewStyle={styles.videoPlayer}
            onError={(e) => {
              console.log("Playback error:", e);
              console.log("ytVideoId:", ytVideoId);
            }}
          />
        </View>
        <SectionDisplay />
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
    // backgroundColor: "blue",
  },
  headingContainer: {
    // backgroundColor: "pink",
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
  videoPlayerContainer: {
    // backgroundColor: "red",
    paddingTop: verticalScale(9),
    paddingBottom: "1.8%",
    // paddingVertical: "2%",
  },
  videoPlayer: {
    opacity: 0.99,
  },
});
