import { StyleSheet, Text, View } from "react-native";
import React, { memo } from "react";
import { moderateScale, verticalScale } from "@/utilities/TrueScale";

type ListEmptyComponentProps = {
  text: string;
  paddingTop?: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  visible: boolean;
};

const ListEmptyComponent = ({
  text = "Empty",
  paddingTop = verticalScale(12),
  fontSize = moderateScale(15),
  fontFamily = "Inter-Medium",
  color = "#868686",
  visible,
}: ListEmptyComponentProps) => {
  return (
    <View
      style={[
        styles.container,
        { paddingTop: paddingTop, opacity: visible ? 1 : 0 },
      ]}
    >
      <Text
        style={[{ fontSize: fontSize, fontFamily: fontFamily, color: color }]}
      >
        {text}
      </Text>
    </View>
  );
};

export default memo(ListEmptyComponent, (prevProps, nextProps) => {
  return (
    prevProps.paddingTop === nextProps.paddingTop &&
    prevProps.text === nextProps.text &&
    prevProps.fontSize === nextProps.fontSize &&
    prevProps.fontFamily === nextProps.fontFamily &&
    prevProps.color === nextProps.color &&
    prevProps.visible === nextProps.visible
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
