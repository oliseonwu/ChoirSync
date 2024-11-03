import {
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

const LoginPage = () => {
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
          <Text style={styles.H1}>Login</Text>

          <TextInput style={styles.Input} placeholder="Enter Email" />

          <TextInput
            secureTextEntry={true}
            style={[styles.Input, { marginTop: verticalScale(19.28) }]}
            placeholder="Enter Password"
          />
        </View>

        <TouchableOpacity style={[styles.Btn, styles.BtnBlack]}>
          <Text style={[styles.btnText, { color: "#ffff" }]}>Login</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginPage;
