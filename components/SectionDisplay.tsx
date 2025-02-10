// SectionDisplay.tsx helps to display the section in a recording

import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { moderateScale } from "@/utilities/TrueScale";
import SectionItem from "./SectionItem";

// Add this data array outside the component
const songData = [
  {
    id: 1,
    songName: "Song 1",
    artistName: "Artist 1",
    timeStamp: "00:00",
    isSelected: true,
  },
  {
    id: 2,
    songName: "Song 2",
    artistName: "Artist 2",
    timeStamp: "01:00",
    isSelected: false,
  },
  {
    id: 3,
    songName: "Song 3",
    artistName: "Artist 3",
    timeStamp: "02:00",
    isSelected: false,
  },
  {
    id: 4,
    songName: "Song 4",
    artistName: "Artist 4",
    timeStamp: "03:00",
    isSelected: false,
  },
  {
    id: 5,
    songName: "Song 5",
    artistName: "Artist 5",
    timeStamp: "04:00",
    isSelected: false,
  },
  {
    id: 6,
    songName: "Song 6",
    artistName: "Artist 6",
    timeStamp: "05:00",
    isSelected: false,
  },
];

export default function SectionDisplay() {
  const renderItem = ({ item }: { item: (typeof songData)[0] }) => (
    <SectionItem
      key={item.id}
      index={item.id}
      songName={item.songName}
      artistName={item.artistName}
      timeStamp={item.timeStamp}
      isSelected={item.isSelected}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeading}>
        <Text style={styles.headingText}>Song List</Text>
      </View>
      <FlatList
        data={songData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.sectionContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "red",
    // marginLeft: moderateScale(19),
  },
  sectionHeading: {
    flex: 0.12,
    // backgroundColor: "blue",
    justifyContent: "center",
    marginLeft: moderateScale(19),
  },
  headingText: {
    fontSize: moderateScale(21),
    fontFamily: "Inter-SemiBold",
    color: "#3E3C48",
  },
  sectionContent: {
    flex: 1,
    // backgroundColor: "green",
  },
});
