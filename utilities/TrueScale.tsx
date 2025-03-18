// What is this 👀: Its a file that has functions which
// modifies any size you pass in using the device
// window size from Dimentions.get().
//--
// Purpose 🏃‍♂️: Allows us to size our components
// with respect to the window size of our device.

import { Dimensions } from "react-native";

// ** Explanation of the two options Dimention.get() offers
// window: reports width/height without the soft menu bar
// screen: reports entire screen's width/height
const { width, height } = Dimensions.get("screen");

// Iphone 12 viewport guide
// const guidelineBaseWidth = 428;
// const guidelineBaseHeight = 926;

// Iphone 15 pro Max
const guidelineBaseWidth = 430;
const guidelineBaseHeight = 932;

// view port for pixel 4 = 393px × 830px

const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;

// if you are returning an object from in an arrow function,
// use "()" so that the compiler doesn't treat the "{" as
// the start of the function (check the next line!!).
const getWindowSize = () => ({ width: width, height: height });

//** How to use these functions

// verticalScale = { height, marginTop, marginBottom,
// marginVertical, line-height, paddingtOP,
// paddingBottom, paddingVertical }
// (up or down).

// horizontalScale = { width, marginLeft, marginRight,
// marginHorizontal, paddingLeft,
// paddingRight, paddingHorizontal }
// (Left or Right)

// moderateScale = {font-size, borderRadius}
// (anything with no hight or width)

const isSmallHeightDevice = () => {
  return height < 700;
};
export {
  horizontalScale,
  verticalScale,
  moderateScale,
  getWindowSize,
  isSmallHeightDevice,
};
