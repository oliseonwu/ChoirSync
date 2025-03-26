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
import { getWindowSize } from "@/utilities/TrueScale";
import ListItem from "./skeletonItems/ListItem";

type SkeletonLoaderProps = {
  width?: number;
  skelectonItem?: React.ReactNode;
};

export const SkeletonLoader = ({
  width = getWindowSize().width,
  skelectonItem = <ListItem />,
}: SkeletonLoaderProps) => {
  const translateX = useSharedValue(-width);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(-width, { duration: 0 }),
        withDelay(500, withTiming(width, { duration: 1000 }))
      ),
      -1
    );
  }, []);

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={[styles.skeletonContainer]}
    >
      {skelectonItem}

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
    // position: "relative",
    overflow: "hidden",
    // backgroundColor: "blue",
  },
  shimmer: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    transform: [{ skewX: "-20deg" }],
  },
});
