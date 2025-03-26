import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";

const AdItem = () => {
  return (
    <View style={styles.adItemContainer}>
      {/* <View style={styles.circle} />
      <View style={styles.adItemContentContainer}>
        <View style={[styles.adItemContent, styles.adItemContentTitle]} />
        <View style={[styles.adItemContent, styles.adItemContentDescription]} />
      </View> */}
      <View style={styles.box}></View>
    </View>
  );
};

export default AdItem;

const styles = StyleSheet.create({
  adItemContainer: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    // opacity: 0.5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(10),
  },
  circle: {
    width: moderateScale(45),
    height: moderateScale(45),
    borderRadius: moderateScale(22.5),
    backgroundColor: "#E5E5E5",
  },
  adItemContentContainer: {
    flex: 1,
    gap: moderateScale(5),
  },
  adItemContent: {
    width: "100%",
    height: moderateScale(20),
    backgroundColor: "#E5E5E5",
    borderRadius: moderateScale(10),
  },
  adItemContentTitle: {
    width: "30%",
  },
  adItemContentDescription: {
    width: "80%",
  },
  box: {
    // marginVertical: "10%",
    width: 320,
    height: 50,
    // borderRadius: moderateScale(10),
    backgroundColor: "#E5E5E5",
    // borderRadius: moderateScale(2),
  },
});
