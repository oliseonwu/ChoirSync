import { StyleSheet, TouchableOpacity, Text } from "react-native";
import React, { memo } from "react";
import {
  moderateScale,
  verticalScale,
  horizontalScale,
} from "@/utilities/TrueScale";
import RightArrow from "@/assets/images/SVG/right-arrow3.svg";

interface SettingsItemProps {
  Icon: React.ElementType;
  title: string;
  onPress?: () => void;
  isLast?: boolean;
  isFirst?: boolean;
}

const SettingsItemComponent = ({
  Icon,
  title,
  onPress,
  isLast = false,
  isFirst = false,
}: SettingsItemProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.settingItem,
        isLast && { borderBottomWidth: verticalScale(0.5) },
        isFirst && { borderTopWidth: verticalScale(0) },
      ]}
      onPress={onPress}
    >
      <Icon
        fill={"#3E3C48"}
        width={moderateScale(21)}
        height={moderateScale(21)}
      />
      <Text style={styles.settingText}>{title}</Text>
      <RightArrow
        width={moderateScale(21)}
        height={moderateScale(21)}
        fill={"#A3A2A2"}
      />
    </TouchableOpacity>
  );
};

export const SettingsItem = memo(
  SettingsItemComponent,
  (prevProps, nextProps) => {
    // This condition is used because this conponent is used in a flashlist and
    // flash list Recycles its render item. This will make sure that the contents
    // in the component respons to chacnges when flash list recycles the component
    return prevProps.title === nextProps.title;
  }
);

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(18),
    borderWidth: verticalScale(0.5),
    borderColor: "#E6E9E8",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  settingText: {
    flex: 1,
    fontSize: moderateScale(16),
    fontFamily: "Inter-Medium",
    color: "#3E3C48",
    marginLeft: horizontalScale(24),
  },
});
