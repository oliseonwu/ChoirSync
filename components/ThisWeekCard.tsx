import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import {
  moderateScale,
  horizontalScale,
  verticalScale,
} from "@/utilities/TrueScale";
import { Image } from "expo-image";

type ThisWeekCardProps = {
  title: string;
  icon: any;
  showDot?: boolean;
  onPress?: () => void;
  disabled?: boolean;
};

const ThisWeekCard: React.FC<ThisWeekCardProps> = ({
  title,
  disabled = false,
  icon,
  showDot = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, disabled && { opacity: 0.5 }]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <View style={styles.iconContainer}>
        <Image
          source={icon}
          style={styles.icon}
          contentFit="cover"
          //   contentPosition={{ top: "50%" }}
        />
      </View>

      <View style={styles.TitleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {showDot && <View style={styles.dot} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: horizontalScale(58),
    width: horizontalScale(190),
    padding: moderateScale(1),
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: moderateScale(6),
    borderWidth: moderateScale(0.5),
    borderColor: "#E6E9E8",
    alignItems: "center",
  },
  iconContainer: {
    width: horizontalScale(58),
    height: "100%",
    marginRight: horizontalScale(10.67),
    // backgroundColor: "red",
  },
  icon: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: moderateScale(6),
    borderBottomLeftRadius: moderateScale(6),
  },
  TitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "blue",
  },
  title: {
    fontSize: moderateScale(14),
    fontFamily: "Inter-SemiBold",
    // width: "72%",
    color: "#3E3C48",
  },
  dot: {
    marginLeft: moderateScale(8.63),
    padding: moderateScale(3.24),
    backgroundColor: "#EA5C43",
    borderRadius: moderateScale(4),
    marginRight: moderateScale(8.63),
  },
});

// export default ThisWeekCard;
export default memo(ThisWeekCard, (prevProps, nextProps) => {
  return prevProps.showDot === nextProps.showDot;
});
