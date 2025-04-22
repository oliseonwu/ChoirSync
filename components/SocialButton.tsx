import { Pressable, StyleSheet, Text, View, ColorValue } from "react-native";
import React, { memo } from "react";
import { horizontalScale, moderateScale } from "@/utilities/TrueScale";
import { SvgProps } from "react-native-svg";

type SocialButtonProps = {
  Icon: React.FC<SvgProps>;
  label?: string;
  onPress: () => void;
  buttonStyle?: object;
  textStyle?: object;
  iconColor?: ColorValue;
  iconSize?: number;
  visible?: boolean;
};

function SocialButton({
  Icon,
  label,
  onPress,
  buttonStyle,
  textStyle,
  iconColor = "#29292A",
  iconSize = moderateScale(18),
  visible = true,
}: SocialButtonProps) {
  if (!visible) return null;

  return (
    <Pressable style={[styles.button, buttonStyle]} onPress={onPress}>
      <View style={styles.contentContainer}>
        <Icon
          fill={iconColor}
          width={iconSize}
          height={iconSize}
          style={[styles.icon, !label && styles.iconOnly]}
        />
        {label ? (
          <Text style={[styles.buttonText, textStyle]}>{label}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: moderateScale(10),
    backgroundColor: "#EAEAEA",
    paddingVertical: moderateScale(15),
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginLeft: horizontalScale(12),
    marginRight: horizontalScale(12),
  },
  iconOnly: {
    margin: 0,
  },
  buttonText: {
    fontSize: moderateScale(16),
    fontFamily: "Inter-Medium",
    textAlign: "center",
    color: "#313234",
  },
});

export default memo(SocialButton, (prevProps, nextProps) => {
  return (
    prevProps.label === nextProps.label &&
    prevProps.visible === nextProps.visible &&
    prevProps.iconColor === nextProps.iconColor &&
    prevProps.buttonStyle === nextProps.buttonStyle &&
    prevProps.textStyle === nextProps.textStyle &&
    prevProps.iconSize === nextProps.iconSize &&
    prevProps.Icon === nextProps.Icon
    // Note: we intentionally exclude onPress from the comparison
    // as function references often change but the actual function remains the same
  );
});
