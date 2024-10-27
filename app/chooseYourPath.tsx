import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  getWindowSize,
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import { useHeaderHeight } from "@react-navigation/elements";
import { StatusBar } from "expo-status-bar";
import { styles } from "@/shared/css/signinLoginCss";
import { router } from "expo-router";

const ChooseYourPath = () => {
  const headerHeight = useHeaderHeight();
  return (
    <View
      style={[
        styles.MainContainer,
        { paddingTop: verticalScale(headerHeight) },
      ]}
    >
      <StatusBar style="dark" />

      <View style={styles.TopContainer}>
        <Text style={[styles.H1, { marginBottom: verticalScale(32) }]}>
          Choose Your Path
        </Text>
        <Text
          style={[styles.regularText, { paddingBottom: verticalScale(34) }]}
        >
          Choose to create a new group or join an existing one to connect with
          your choir.
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <TouchableOpacity
            style={{
              alignItems: "center",
              alignSelf: "flex-start",
            }}
          >
            <View
              style={{
                width: moderateScale(130),
                height: moderateScale(130),
                backgroundColor: "#D9D9D9",
                borderRadius: 10,
              }}
            ></View>
            <Text style={{ paddingTop: verticalScale(12) }}>Join a Group</Text>
          </TouchableOpacity>

          <View style={{ width: "12%" }}></View>

          <TouchableOpacity
            style={{
              alignItems: "center",
              alignSelf: "flex-start",
            }}
          >
            <View
              style={{
                width: moderateScale(130),
                height: moderateScale(130),
                backgroundColor: "#D9D9D9",
                borderRadius: 10,
              }}
            ></View>
            <Text style={{ paddingTop: verticalScale(12) }}>
              Create a Group
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={[styles.Btn, styles.BtnBlack]}>
        <Text style={[styles.btnText, { color: "#ffff" }]}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChooseYourPath;
