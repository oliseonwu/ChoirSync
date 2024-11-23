import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/Themed";
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
};

const ThisWeekCard: React.FC<ThisWeekCardProps> = ({
  title,
  icon,
  showDot = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
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
        {showDot && <View style={styles.dot} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: horizontalScale(58),
    width: horizontalScale(190),
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: moderateScale(6),
  },
  iconContainer: {
    width: horizontalScale(58),
    height: "100%",
    marginRight: horizontalScale(10.67),
    // backgroundColor: "red",
    borderRadius: moderateScale(6),
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
  dot: {
    marginLeft: moderateScale(8.63),
    padding: moderateScale(3.24),
    backgroundColor: "#FF3B30",
    borderRadius: moderateScale(4),
    marginRight: moderateScale(8.63),
  },
  title: {
    fontSize: moderateScale(14),
    fontFamily: "Inter-SemiBold",
    width: "70%",
    color: "#3E3C48",
  },
});

// export default ThisWeekCard;
export default memo(ThisWeekCard, (prevProps, nextProps) => {
  return prevProps.showDot === nextProps.showDot;
});
