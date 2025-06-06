import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
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
  MainContainer: {
    backgroundColor: "#F9F7F7",
    flex: 1,
  },

  H1: {
    fontSize: moderateScale(24),
    fontFamily: "Inter-Bold",
    color: "#313234",
    marginTop: verticalScale(37),
    marginBottom: verticalScale(45),
    marginLeft: horizontalScale(-2),
  },
  TopContainer: {
    flex: 1,
    marginHorizontal: horizontalScale(24),
  },
  Input: {
    borderColor: "#000000",
    color: "#313234",
    borderWidth: moderateScale(1),
    // padding: Platform.OS == "android"?
    // moderateScale(21) - (0.4/100) * getWindowSize().height:
    // moderateScale(21),
    height: verticalScale(58),
    paddingLeft: horizontalScale(18),
    borderRadius: 10,
    fontSize: moderateScale(16),
    fontFamily: "Inter-Regular",
  },
  Btn: {
    padding: moderateScale(18),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(10),
    marginTop: "5%",
    marginHorizontal: horizontalScale(21),
    marginBottom: verticalScale(71),
  },
  BtnBlack: {
    backgroundColor: "#313234",
  },
  btnText: {
    fontFamily: "Inter-SemiBold",
    fontSize: moderateScale(16),
  },
  regularText: {
    color: "#595959",
    fontSize: moderateScale(16),
    fontFamily: "Inter-Regular",
  },
  heading1: {
    fontSize: moderateScale(20),
    fontFamily: "Inter-Medium",
    color: "#3E3C48",
    marginBottom: verticalScale(26),
  },
  flashListContent: {
    paddingVertical: verticalScale(10),
  },
});
