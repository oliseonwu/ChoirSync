import { StyleSheet, Text, View } from "react-native";
import React, { memo } from "react";
import Constants from "expo-constants";
import { verticalScale } from "@/utilities/TrueScale";

export function CustomHeaderComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <View style={styles.statusBar}></View>
      {children}
    </>
  );
}

export default memo(CustomHeaderComponent);

const styles = StyleSheet.create({
  statusBar: {
    // backgroundColor: "red",
    height: Constants.statusBarHeight,
    marginTop: verticalScale(2),
  },
});
