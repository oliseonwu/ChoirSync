import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import BackButton from "@/assets/images/SVG/back-Button.svg";
import { horizontalScale, moderateScale } from "@/utilities/TrueScale";

type BackButtonComponentProps = {
  isLoading?: boolean;
  style?: object;
};

const BackButtonComponent = ({
  isLoading = false,
  style,
}: BackButtonComponentProps) => {
  //   console.log("BackButtonComponent rendered, isLoading:", isLoading);

  return (
    <TouchableOpacity
      onPress={router.back}
      disabled={isLoading}
      style={[{ opacity: isLoading ? 0.5 : 1 }, style]}
      hitSlop={{ top: 40, bottom: 40, left: 40, right: 40 }}
    >
      <BackButton style={styles.backButton} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    marginLeft: horizontalScale(0),
  },
});

export default React.memo(
  BackButtonComponent,
  (prevProps, nextProps) => prevProps.isLoading === nextProps.isLoading
);
