import { Pressable, StyleSheet, View, Text } from "react-native";
import { Portal } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useBottomSheet } from "@/contexts/ButtomSheetContext";
import { moderateScale, verticalScale } from "@/utilities/TrueScale";
import CloseIcon from "@/assets/images/SVG/close-light.svg";
import { memo, useCallback } from "react";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
import { Platform } from "react-native";

type Props = {
  children: React.ReactNode;
};

export const BottomSheet = ({ children }: Props) => {
  const { animationProgress, close } = useBottomSheet();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withSpring(animationProgress.value === 0 ? 1000 : 0, {
          damping: 20,
        }),
      },
    ],
  }));

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    opacity: withSpring(animationProgress.value === 0 ? 0 : 0.5, {
      damping: 20,
    }),
    pointerEvents: animationProgress.value === 0 ? "none" : "auto",
  }));

  const handleCloseWithHaptics = useCallback(() => {
    close(true);
  }, []);

  const handleCloseWithoutHaptics = useCallback(() => {
    close(false);
  }, []);

  return (
    <Portal>
      <AnimatedPressable
        style={[styles.background, animatedBackgroundStyle]}
        onPress={handleCloseWithoutHaptics}
      ></AnimatedPressable>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Get Started</Text>
          <CloseIcon
            width={moderateScale(30)}
            height={moderateScale(30)}
            hitSlop={moderateScale(50)}
            fill="#B3B3B4"
            onPress={handleCloseWithHaptics}
          />
        </View>
        {children}
      </Animated.View>
    </Portal>
  );
};

export default memo(BottomSheet, (prevProps, nextProps) => {
  return true;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    width: "96%",
    minHeight: "39%",
    margin: "2%",
    marginBottom: "0.8%",
    backgroundColor: "#F1F1F1",
    borderRadius: Platform.OS === "ios" ? moderateScale(45) : moderateScale(10),
    borderTopLeftRadius:
      Platform.OS === "ios" ? moderateScale(40) : moderateScale(10),
    borderTopRightRadius:
      Platform.OS === "ios" ? moderateScale(40) : moderateScale(10),
    paddingBottom: verticalScale(28),
  },
  background: {
    flex: 1,
    backgroundColor: "black",
  },
  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: "5%",
    marginTop: "5%",
    marginBottom: "4%",
  },

  headerText: {
    fontSize: verticalScale(22),
    fontFamily: "Inter-Medium",
    letterSpacing: 0.2,
    color: "#313234",
    flex: 1,
  },
});
