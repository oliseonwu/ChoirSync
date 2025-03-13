import React, { useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { moderateScale } from "@/utilities/TrueScale";
import Animated, {
  interpolateColor,
  ReduceMotion,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface SwitchProps {
  isOn: SharedValue<boolean>;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: number;
}

const ASPECT_RATIO = 1.8; // ASPECT RATIO OF THE SWITCH
export function AutomaticSwitch({
  isOn,
  onValueChange,
  disabled = false,
  size = moderateScale(25),
}: SwitchProps) {
  let thumbMaxTranslateX = size * ASPECT_RATIO;
  thumbMaxTranslateX = thumbMaxTranslateX - size;

  const translateXStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(isOn.value ? thumbMaxTranslateX : 0, {
            duration: 1051,
            dampingRatio: 0.5,
            stiffness: 500,
            overshootClamping: false,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 2,
            reduceMotion: ReduceMotion.System,
          }),
        },
      ],
    };
  });

  const backgroundColorStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        isOn.value ? thumbMaxTranslateX : 0,
        [0, thumbMaxTranslateX],
        ["#E9E9EA", "#313234"]
      ),
    };
  });
  return (
    <Animated.View
      style={[
        styles.switch,
        backgroundColorStyle,
        { height: size, borderRadius: size / 2 },
        disabled && { opacity: 0.5 },
      ]}
    >
      <Animated.View
        style={[styles.thumb, { borderRadius: size / 2 }, translateXStyle]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  switch: {
    // width: moderateScale(40),
    // height: moderateScale(25),

    padding: moderateScale(2),
    justifyContent: "center",
    aspectRatio: ASPECT_RATIO,
  },
  thumb: {
    aspectRatio: 1,
    // width: moderateScale(20),
    height: "100%",

    backgroundColor: "#FFFFFF",
  },
});
