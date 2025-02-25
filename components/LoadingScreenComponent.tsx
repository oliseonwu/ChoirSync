import { horizontalScale } from "@/utilities/TrueScale";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Portal } from "react-native-paper";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useLoading } from "@/contexts/LoadingContext";
import { memo } from "react";

export function LoadingScreenComponent() {
  const { opacity } = useLoading();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    display: opacity.value === 0 ? "none" : "flex",
  }));

  return (
    <Portal>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.loadingBox}>
          <ActivityIndicator
            size="large"
            color="#fff"
            style={{ opacity: 0.9 }}
          />
        </View>
      </Animated.View>
    </Portal>
  );
}

export default memo(LoadingScreenComponent);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingBox: {
    width: horizontalScale(100),
    aspectRatio: 1,
    backgroundColor: "rgba(48, 46, 46, 1)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#fff",
    elevation: 100,
  },
});
