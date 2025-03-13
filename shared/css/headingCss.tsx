import { moderateScale, verticalScale } from "@/utilities/TrueScale";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // profilePic: {
  //   width: moderateScale(39),
  //   height: moderateScale(39),
  //   borderRadius: moderateScale(19.5),
  //   // marginRight: moderateScale(20),
  //   marginBottom: verticalScale(0.5),
  // },
  profilePic: {
    width: moderateScale(39),
    height: moderateScale(39),
    borderRadius: moderateScale(19.5),
    // marginRight: moderateScale(20),
    marginBottom: verticalScale(1),
  },
  headerTitle: {
    fontFamily: "Inter-SemiBold",
    color: "#3E3C48",
  },
  smallHeaderTitle: {
    fontFamily: "Inter-Medium",
    color: "#868686",
    fontSize: moderateScale(14),
  },
});
