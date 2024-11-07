import {
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from "react-native";
import React from "react";
import { verticalScale } from "@/utilities/TrueScale";
import { useHeaderHeight } from "@react-navigation/elements";
import { StatusBar } from "expo-status-bar";
import { styles } from "@/shared/css/signinLoginCss";
import { router } from "expo-router";
const SignUpPage = () => {
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
          <Text style={styles.H1}>SignUp</Text>

          <TextInput
            style={styles.Input}
            placeholder="Enter Email"
            placeholderTextColor="#C9C8CA"
          />

          <TextInput
            secureTextEntry={true}
            style={[styles.Input, { marginTop: verticalScale(19.28) }]}
            placeholder="Enter Password"
            placeholderTextColor="#C9C8CA"
          />
        </View>

        <TouchableOpacity
          style={[styles.Btn, styles.BtnBlack]}
          onPress={() => router.navigate("/name")}
        >
          <Text style={[styles.btnText, { color: "#ffff" }]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignUpPage;
