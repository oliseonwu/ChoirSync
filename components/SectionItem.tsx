import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { moderateScale, verticalScale } from "@/utilities/TrueScale";

export default function SectionItem({
  index,
  songName,
  artistName,
  isSelected,
  timeStamp,
}: {
  index: number;
  songName: string;
  artistName: string;
  isSelected: boolean;
  timeStamp: string;
}) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isSelected ? "#EEEDED" : "#fff" },
      ]}
    >
      <Text
        style={[
          styles.songIndex,
          { fontFamily: isSelected ? "Inter-Bold" : "Inter-Medium" },
        ]}
      >
        {index}.
      </Text>
      <View style={styles.songInfoContainer}>
        <Text
          style={[
            styles.songName,
            { fontFamily: isSelected ? "Inter-Bold" : "Inter-Medium" },
          ]}
        >
          {songName}
        </Text>
        <Text style={[styles.artistName]}>{artistName}</Text>
      </View>
      <View style={styles.timeStampContainer}>
        <Text style={styles.timeStamp}>{timeStamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: verticalScale(80),
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: moderateScale(19),
  },
  songIndex: {
    fontSize: moderateScale(16),
    color: "#3E3C48",
  },
  songInfoContainer: {
    marginLeft: moderateScale(21),
  },
  songName: {
    fontSize: moderateScale(16),
    color: "#3E3C48",
  },
  artistName: {
    fontSize: moderateScale(14),
    marginTop: verticalScale(6.2),
    color: "#3E3C48",
    fontFamily: "Inter-Light",
  },
  timeStamp: {
    fontSize: moderateScale(14),
    color: "#3E3C48",
    fontFamily: "Inter-Light",
    marginRight: moderateScale(26),
  },
  timeStampContainer: {
    flex: 1,
    alignContent: "center",
    alignItems: "flex-end",
  },
});
