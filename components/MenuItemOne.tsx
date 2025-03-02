import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import RightArrow from "@/assets/images/SVG/right-arrow3.svg";
import { getWindowSize } from "@/utilities/TrueScale";

const { width } = getWindowSize();

interface MenuItemOneProps {
  label: string;
  value: string;
  disabled?: boolean;
  borderBottomWidth?: number;
  onPress?: () => void;
}

const MenuItemOne: React.FC<MenuItemOneProps> = ({
  label,
  value,
  disabled = false,
  borderBottomWidth = 0,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.infoRow,
        { borderBottomWidth: borderBottomWidth, opacity: disabled ? 0.5 : 1 },
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.value]}>
        {value}
      </Text>
      {!disabled && (
        <RightArrow
          fill={disabled ? "#E6E9E8" : "#A3A2A2"}
          height={moderateScale(21)}
          width={moderateScale(21)}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    paddingVertical: verticalScale(16),
    alignItems: "center",
    borderWidth: moderateScale(0.5),
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: moderateScale(0.5),
    borderColor: "#F7F7F7",

    paddingHorizontal: horizontalScale(10),
    // backgroundColor: "red",
  },
  label: {
    flex: 1,
    fontFamily: "Inter-Medium",
    fontSize: moderateScale(16),
    color: "#3E3C48",
  },
  value: {
    fontFamily: "Inter-Medium",
    fontSize: moderateScale(16),
    color: "#A3A2A2",
    textAlign: "right",
    marginRight: horizontalScale(5),
    width: (width * 46) / 100,
  },
  disabledText: {
    color: "#E6E9E8",
  },
});

export default MenuItemOne;
