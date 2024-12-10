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

type SongListItemProps = {
  order: number;
  imgUrl?: string;
  songName: string;
  artistName: string;
  isPlaying: boolean;
  space: boolean;
};

export default function SongListItem({
  order,
  imgUrl,
  songName,
  artistName,
  isPlaying,
  space,
}: SongListItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[styles.container, space && { marginTop: verticalScale(44) }]}
    >
      <Text style={styles.order}>{order}</Text>
      <View style={styles.clipArtCover}>
        {/* <Image
          source={{ uri: imgUrl }}
          style={styles.clipArt}
          contentFit="cover"
        /> */}
        <EarPhoneIcon />
      </View>
      <View style={styles.songInfo}>
        <Text style={styles.songName}>{songName}</Text>
        <Text style={styles.artistName}>{artistName}</Text>
      </View>
      {isPlaying === false && <PlayIcon width={moderateScale(25)} />}
      {isPlaying === true && <PauseIcon width={moderateScale(25)} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(30),
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
