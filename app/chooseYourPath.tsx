import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
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
import LoadingButton from "@/components/LoadingButton";

const ChooseYourPath = () => {
  const headerHeight = useHeaderHeight();
  const [selectedPath, setSelectedPath] = useState<"join" | "create">("join");

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

        <View style={style2.Cards}>
          <LabeledCard
            imgUrl=""
            label="Join a Group"
            onPress={() => {
              setSelectedPath("join");
            }}
            selected={selectedPath === "join"}
          ></LabeledCard>

          <View style={{ width: "12%" }}></View>

          <LabeledCard
            imgUrl=""
            label="Create a Group"
            onPress={() => {
              setSelectedPath("create");
            }}
            selected={selectedPath === "create"}
            disabled={true}
          ></LabeledCard>
        </View>
      </View>

      <LoadingButton
        isLoading={false}
        onPress={() => router.navigate("/chooseYourGroup")}
        buttonText="Next"
        style={[styles.Btn, styles.BtnBlack]}
        textStyle={[styles.btnText, { color: "#ffff" }]}
        backgroundColor="#313234"
      />
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
