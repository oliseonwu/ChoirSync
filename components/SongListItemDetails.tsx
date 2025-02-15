import { View, Text, StyleSheet } from "react-native";
import React, { memo } from "react";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import EarPhoneIcon from "@/assets/images/SVG/earphone.svg";

const MemoizedEarPhoneIcon = memo(() => <EarPhoneIcon />);

export function SongListItemDetails(props: {
  index: number;
  songName: string;
  singerName: string;
}) {
  const { index, songName, singerName } = props;
  return (
    <>
      <Text style={styles.order}>{index}</Text>
      <View style={styles.clipArtCover}>
        {/* <Image
          source={{ uri: imgUrl }}
          style={styles.clipArt}
          contentFit="cover"
        /> */}
        <MemoizedEarPhoneIcon />
      </View>
      <View style={styles.songInfo}>
        <Text style={styles.songName} ellipsizeMode="tail" numberOfLines={1}>
          {songName}
        </Text>
        <Text style={styles.artistName}>{singerName}</Text>
      </View>
      {/* {isPlaying ? <MemoizedPauseIcon /> : <MemoizedPlayIcon />} */}
    </>
  );
}

// export default SongListItemDetails;
export default memo(SongListItemDetails);

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
