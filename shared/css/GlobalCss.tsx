import { moderateScale, verticalScale } from "@/utilities/TrueScale";
import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  profilePic: {
    width: moderateScale(39),
    height: moderateScale(39),
    borderRadius: moderateScale(19.5),
    // marginRight: moderateScale(20),
    marginBottom: verticalScale(0.5),
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
