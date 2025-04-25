import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { moderateScale, verticalScale } from "@/utilities/TrueScale";
import { useHeaderHeight } from "@react-navigation/elements";
import { StatusBar } from "expo-status-bar";
import { globalStyles } from "@/shared/css/GlobalCss";
import { router } from "expo-router";
import LoadingButton from "@/components/LoadingButton";
import { emailAuthService } from "@/services/EmailAuthService";
const EmailPage = () => {
  const headerHeight = useHeaderHeight();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await emailAuthService.checkUserExistsByEmail(email);

      console.log(result);
      //("exists" in result) - properly if the result includes the "exists" property
      if (result.success && "exists" in result && result.exists) {
        // Navigate to password page for existing users
        router.push({
          pathname: "/existingUserPassword",
          params: { email },
        });
      } else {
        // Navigate to password creation for new users
        router.push({
          pathname: "/newUserPassword",
          params: { email },
        });
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to submit email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[
          globalStyles.MainContainer,
          { paddingTop: verticalScale(headerHeight) },
        ]}
      >
        <StatusBar style="dark" />

        <View style={globalStyles.TopContainer}>
          <Text style={[globalStyles.H1, { marginBottom: verticalScale(32) }]}>
            Enter Your Email
          </Text>

          <Text style={globalStyles.regularText}>
            Please enter your email address to continue.
          </Text>

          <TextInput
            style={[globalStyles.Input, { marginTop: verticalScale(32) }]}
            placeholder="example@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            placeholderTextColor="#C9C8CA"
          />
        </View>

        <LoadingButton
          isLoading={isLoading}
          onPress={handleSubmit}
          buttonText="Continue"
          style={[globalStyles.Btn, globalStyles.BtnBlack]}
          textStyle={[globalStyles.btnText, { color: "#ffff" }]}
          backgroundColor="#313234"
          disabled={!isValidEmail(email)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EmailPage;
