import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import React from "react";
import { View, StyleSheet } from "react-native";

const ListItem = () => (
  <>
    <View style={styles.listItem}>
      <View style={styles.skeletonName} />
      <View style={styles.skeletonButton} />
    </View>
    <View style={styles.listItem}>
      <View style={styles.skeletonName} />
      <View style={styles.skeletonButton} />
    </View>
    <View style={styles.listItem}>
      <View style={styles.skeletonName} />
      <View style={styles.skeletonButton} />
    </View>
    <View style={styles.listItem}>
      <View style={styles.skeletonName} />
      <View style={styles.skeletonButton} />
    </View>
  </>
);

export default ListItem;

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(20),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  skeletonName: {
    width: horizontalScale(200),
    height: verticalScale(20),
    backgroundColor: "#E5E5E5",
    borderRadius: moderateScale(4),
  },
  skeletonButton: {
    width: horizontalScale(60),
    height: verticalScale(30),
    backgroundColor: "#E5E5E5",
    borderRadius: moderateScale(4),
  },
});
