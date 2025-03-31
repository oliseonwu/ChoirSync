import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { memo, useCallback, useMemo } from "react";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import EarPhoneIcon from "@/assets/images/SVG/earphone.svg";
import PlayIcon from "@/assets/images/SVG/item-play.svg";
import PauseIcon from "@/assets/images/SVG/item-pause.svg";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { NewSong, Recording } from "@/types/music.types";
import { useCurrentTrack } from "@/contexts/CurrentTrackContext";
import { useNowPlayingContext } from "@/contexts/NowPlayingContext";
import {
  CurrentTrackContextType,
  CurrentSongDetailsSVType,
} from "@/types/currentTrackContext.types";

export function SongItem(props: {
  index: number;
  recording: Recording | NewSong;
  currentSongDetailsSV: CurrentSongDetailsSVType;
  changeCurrentTrack: (
    songId: string,
    songName: string,
    artistName: string,
    songUrl: string
  ) => void;
}) {
  const { index, recording, currentSongDetailsSV, changeCurrentTrack } = props;
  const { openPlayer } = useNowPlayingContext();

  const showPlayIcon = useAnimatedStyle(() => {
    return {
      position: "absolute",
      opacity:
        currentSongDetailsSV.value.songId === recording.id &&
        currentSongDetailsSV.value.state === "playing"
          ? 0
          : 1,
    };
  });

  const MemoizedEarPhoneIcon = memo(() => <EarPhoneIcon />);
  const MemoizedPauseIcon = memo(() => <PauseIcon />);
  const MemoizedPlayIcon = memo(() => <PlayIcon />);

  const showPauseIcon = useAnimatedStyle(() => {
    return {
      position: "absolute",

      opacity:
        currentSongDetailsSV.value.songId === recording.id &&
        currentSongDetailsSV.value.state === "playing"
          ? 1
          : 0,
    };
  });

  const memoizedClipArtCover = useMemo(() => {
    return (
      <View style={styles.clipArtCover}>
        <MemoizedEarPhoneIcon />
      </View>
    );
  }, []);

  const memoizedPlayPauseButton = useMemo(() => {
    return (
      <View
        style={{
          position: "relative",
          width: moderateScale(25),
          height: moderateScale(25),
        }}
      >
        <Animated.View style={showPlayIcon}>
          <MemoizedPlayIcon />
        </Animated.View>

        <Animated.View style={showPauseIcon}>
          <MemoizedPauseIcon />
        </Animated.View>
      </View>
    );
  }, []);

  const handlePress = useCallback(async () => {
    changeCurrentTrack(
      recording.id,
      recording.name,
      recording.singerName,
      recording?.link ?? ""
    );

    openPlayer();
  }, [recording.id]);

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.order}>{index}</Text>
      {memoizedClipArtCover}
      <View style={styles.songInfo}>
        <Text style={styles.songName} ellipsizeMode="tail" numberOfLines={1}>
          {recording.name}
        </Text>
        <Text style={styles.artistName}>{recording.singerName}</Text>
      </View>
      {memoizedPlayPauseButton}
    </TouchableOpacity>
  );
}

export default memo(SongItem, (prevProps, nextProps) => {
  return (
    prevProps.recording.id === nextProps.recording.id &&
    prevProps.index === nextProps.index
  );
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(30),
  },

  title: {
    fontSize: moderateScale(20),
    fontFamily: "Inter-Medium",
    color: "#3E3C48",
    marginBottom: verticalScale(26),
    paddingHorizontal: moderateScale(16),
  },
  title1: {
    marginTop: verticalScale(32),
  },
  title2: {
    marginTop: verticalScale(97),
  },

  order: {
    fontSize: moderateScale(13),
    fontFamily: "Inter-Light",
    color: "#666666",
  },

  clipArtCover: {
    alignItems: "center",
    justifyContent: "center",
    width: moderateScale(63),
    height: moderateScale(63),
    marginLeft: horizontalScale(32),
    marginRight: horizontalScale(21),
    borderRadius: moderateScale(6),
    backgroundColor: "#F2F2F2", // Important for shadow visibility
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    // // Android shadow
    elevation: 2,
  },

  clipArt: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(6),
  },

  songInfo: {
    flex: 1,
    marginRight: horizontalScale(21),
  },

  songName: {
    fontSize: moderateScale(16),
    fontFamily: "Inter-Medium",
    marginBottom: verticalScale(10),
    color: "#3E3C48",
  },

  artistName: {
    fontSize: moderateScale(14),
    fontFamily: "Inter-Light",
    color: "#969696",
  },
});
