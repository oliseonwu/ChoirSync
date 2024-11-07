import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
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

const NamePage = () => {
  const headerHeight = useHeaderHeight();
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[
          styles.MainContainer,
          { paddingTop: verticalScale(headerHeight) },
        ]}
      >
        <StatusBar style="dark" />

        <View style={styles.TopContainer}>
          <Text style={[styles.H1, { marginBottom: verticalScale(32) }]}>
            Tell us about yourself
          </Text>
          <Text
            style={[styles.regularText, { paddingBottom: verticalScale(34) }]}
          >
            Please enter your legal name below
          </Text>

          <TextInput
            style={styles.Input}
            placeholder="First Name"
            placeholderTextColor="#C9C8CA"
          />

          <TextInput
            style={[styles.Input, { marginTop: verticalScale(19.28) }]}
            placeholder="Last Name"
            placeholderTextColor="#C9C8CA"
          />
        </View>

        <TouchableOpacity
          style={[styles.Btn, styles.BtnBlack]}
          onPress={() => router.navigate("/chooseYourPath")}
        >
          <Text style={[styles.btnText, { color: "#ffff" }]}>Next</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NamePage;
