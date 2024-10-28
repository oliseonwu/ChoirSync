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
import LabeledCard from "@/components/LabeledCard";

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
        <Text style={[styles.regularText]}>
          Choose to create a new group or join an existing one to connect with
          your choir.
        </Text>

        <View style={style2.Cards}>
          <LabeledCard
            imgUrl=""
            label="Join a Group"
            onPress={() => {}}
          ></LabeledCard>

          <View style={{ width: "12%" }}></View>

          <LabeledCard
            imgUrl=""
            label="Create a Group"
            onPress={() => {}}
          ></LabeledCard>
        </View>
      </View>

      <TouchableOpacity style={[styles.Btn, styles.BtnBlack]}>
        <Text style={[styles.btnText, { color: "#ffff" }]}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChooseYourPath;

const style2 = StyleSheet.create({
  Cards: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "12%",
  },
});
