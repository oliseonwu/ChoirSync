import { horizontalScale } from "@/utilities/TrueScale";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Portal } from "react-native-paper";

type LoadingScreenProps = {
  isVisible: boolean;
};

export function LoadingScreenComponent({ isVisible }: LoadingScreenProps) {
  if (!isVisible) return null;

  return (
    <Portal>
      <View style={styles.container}>
        <View style={styles.loadingBox}>
          <ActivityIndicator
            size="large"
            color="#fff"
            style={{ opacity: 0.9 }}
          />
        </View>
      </View>
    </Portal>
  );
}

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
