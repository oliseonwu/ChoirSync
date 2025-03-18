import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  FadeIn,
  useSharedValue,
} from "react-native-reanimated";
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from "@/utilities/TrueScale";

const SkeletonItem = () => (
  <View style={styles.listItem}>
    <View style={styles.skeletonName} />
    <View style={styles.skeletonButton} />
  </View>
);

export const SkeletonLoader = ({ width }: { width: number }) => {
  const translateX = useSharedValue(-width);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(-width, { duration: 0 }),
        withDelay(1000, withTiming(width, { duration: 1000 }))
      ),
      -1
    );
  }, []);

  return (
    <Animated.View entering={FadeIn} style={[styles.skeletonContainer]}>
      {[1, 2, 3, 4].map((key) => (
        <SkeletonItem key={key} />
      ))}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.shimmer,
          {
            backgroundColor: "white",
            opacity: 0.3,
          },
          animatedStyle,
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(20),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  shimmer: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    transform: [{ skewX: "-20deg" }],
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
