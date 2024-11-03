import {
  Platform,
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
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import { useHeaderHeight } from "@react-navigation/elements";
import { StatusBar } from "expo-status-bar";
import { styles } from "@/shared/css/signinLoginCss";
import { router, useLocalSearchParams } from "expo-router";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const InviteCodePage = () => {
  const headerHeight = useHeaderHeight();
  const { groupName } = useLocalSearchParams<{ groupName: string }>();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: groupName || "",
      headerTitleStyle: {
        fontFamily: "Inter-Regular",
        fontSize: moderateScale(14),
        color: "#595959",
      },
    });
  }, [navigation, groupName]);

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
            Enter Invite Code
          </Text>

          <Text style={styles.regularText}>
            Enter the invite code you received from the group creator.
          </Text>

          <TextInput
            style={[styles.Input, { marginTop: verticalScale(32) }]}
            placeholder="Enter Password"
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity
          style={[styles.Btn, styles.BtnBlack]}
          onPress={() => {
            // Handle join action
            router.navigate("/(tabs)");
          }}
        >
          <Text style={[styles.btnText, { color: "#ffff" }]}>Next</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InviteCodePage;

const style2 = StyleSheet.create({
  groupName: {
    fontFamily: "Inter-Regular",
    fontSize: moderateScale(16),
    color: "#595959",
    textAlign: "center",
    marginBottom: verticalScale(32),
  },
  description: {
    color: "#595959",
    fontSize: moderateScale(16),
    fontFamily: "Inter-Light",
    marginBottom: verticalScale(8),
  },
});
