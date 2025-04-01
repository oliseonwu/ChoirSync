import { View, Text, StyleSheet } from "react-native";
import React, { memo, useEffect, useMemo, useState } from "react";
import { EventRegister } from "react-native-event-listeners";
import { Portal } from "react-native-paper";
import Constants from "expo-constants";

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
import songService from "@/services/sqlite/songService";
import { useSQLiteContext } from "expo-sqlite";

export function NowPlayingComponent() {
  const { yOffsetSV, closePlayer } = useNowPlayingContext();
  const [isSaved, setIsSaved] = useState(false);
  const localDb = useSQLiteContext();
  const { togglePlay, currentTrackState, currentTrackDetails } =
    useCurrentTrack();
  const [headingText, setHeadingText] = useState("");
  const [ytVideoId, setYtVideoId] = useState<string | undefined>(undefined);
  const VIDEO_ASPECT_RATIO = 16 / 9;
  const SCREEN_WIDTH = getWindowSize().width;

  useEffect(() => {
    setHeadingText(currentTrackDetails.songName);
    setYtVideoId(getYouTubeVideoId(currentTrackDetails.songUrl));

    checkIfSongIsSaved().then((isSaved) => {
      setIsSaved(isSaved);
    });
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

  const handleSaveIconPress = async () => {
    if (!isSaved) {
      await saveCurrentTrack();
    } else {
      await deleteCurrentTrack();
    }

    fireSaveEvent();
    setIsSaved(!isSaved);
  };

  const saveCurrentTrack = async () => {
    await songService.createSong(
      currentTrackDetails.songName,
      currentTrackDetails.artistName,
      currentTrackDetails.songUrl,
      localDb
    );
  };

  const deleteCurrentTrack = async () => {
    await songService.deleteSong(currentTrackDetails.songUrl, localDb);
  };

  const checkIfSongIsSaved = async () => {
    const isSaved = await songService.getSongsByLink(
      currentTrackDetails.songUrl,
      localDb
    );

    return !!isSaved;
  };

  const SaveIconMemoized = useMemo(
    () => (
      <SaveIcon
        opacity={isSaved ? 1 : 0.2}
        height={verticalScale(25)}
        width={horizontalScale(22)}
        hitSlop={{ top: 40, bottom: 40, left: 40, right: 40 }}
        onPress={handleSaveIconPress}
        fill={isSaved ? "#BDA293" : "black"}
      />
    ),
    [isSaved, ytVideoId]
  );

  const ArrownDownMemoized = useMemo(
    () => (
      <ArrownDown
        height={verticalScale(25)}
        width={horizontalScale(22)}
        fill={"#313234"}
        onPress={handleClose}
        hitSlop={{ top: 40, bottom: 40, left: 40, right: 40 }}
      />
    ),
    [ytVideoId, currentTrackState]
  );

  const yTPlayer = useMemo(() => {
    return (
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
          onReady={() => {
            console.log("YTPlayer is ready");
          }}
        />
      </View>
    );
  }, [ytVideoId, currentTrackState]);

  /*
  This function is used to fire an event when the save icon is pressed.
  Other components can listen to this event and perform actions based on the event.
  */
  const fireSaveEvent = () => {
    EventRegister.emit("saveSong", {
      songName: currentTrackDetails.songName,
      artistName: currentTrackDetails.artistName,
      link: currentTrackDetails.songUrl,
      isSaved: !isSaved,
    });
  };
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
          {ArrownDownMemoized}

          <Text style={styles.headingText}>{headingText}</Text>

          {SaveIconMemoized}
        </View>

        {yTPlayer}
        <SectionDisplay />
      </Animated.View>
    </Portal>
  );
}
export default memo(NowPlayingComponent, (prevProps, nextProps) => {
  return true;
});

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
