import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PlayIcon from "@/assets/images/SVG/item-play.svg";
import PauseIcon from "@/assets/images/SVG/item-pause.svg";
import EarPhoneIcon from "@/assets/images/SVG/earphone.svg";
import { useMiniPlayer } from "@/contexts/MiniPlayerContext";
import { memo } from "react";

type Recording = {
  id: string;
  name: string;
  singerName: string;
  channel: "YT" | "file";
  link?: string;
  file?: string;
  isMultiTracked: boolean;
  rehearsalDate: Date;
  categoryId: string;
  choirGroupId: string;
};

type SongListItemProps = {
  recording: Recording;
  index: number;
  isPlaying: boolean;
  space: boolean;
  onPress: () => void;
  showHeader: boolean;
  isFirst: boolean;
};

export function SongListItem({
  recording,
  index,
  isPlaying,
  space,
  showHeader,
  onPress,
  isFirst,
}: SongListItemProps) {
  const getHeaderText = (date: Date, index: number) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const oneWeekAgo = new Date(
      currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
    );

    // Check if this is the most recent recording and within the last week
    const isFirstGroup = index === 0;
    const isWithinWeek = new Date(date) >= oneWeekAgo;

    if (isFirstGroup && isWithinWeek) {
      return "This Week's Rehearsal";
    }
    return new Date(date).toLocaleDateString("en-US", { timeZone: "UTC" });
  };

  return (
    <>
      {showHeader && (
        <Text style={[styles.title, isFirst ? styles.title1 : styles.title2]}>
          {getHeaderText(recording.rehearsalDate, index)}
        </Text>
      )}

      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          onPress();
        }}
        style={[styles.container, space && { marginTop: verticalScale(44) }]}
      >
        <Text style={styles.order}>{index}</Text>
        <View style={styles.clipArtCover}>
          {/* <Image
          source={{ uri: imgUrl }}
          style={styles.clipArt}
          contentFit="cover"
        /> */}
          <EarPhoneIcon />
        </View>
        <View style={styles.songInfo}>
          <Text style={styles.songName} ellipsizeMode="tail" numberOfLines={1}>
            {recording.name}
          </Text>
          <Text style={styles.artistName}>{recording.singerName}</Text>
        </View>
        {isPlaying === false && <PlayIcon width={moderateScale(25)} />}
        {isPlaying === true && <PauseIcon width={moderateScale(25)} />}
      </TouchableOpacity>
    </>
  );
}
// export default ThisWeekCard;
export default memo(SongListItem, (prevProps, nextProps) => {
  return prevProps.isPlaying === nextProps.isPlaying;
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(30),
    paddingBottom: verticalScale(2),
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
    // Android shadow
    elevation: 4,
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
