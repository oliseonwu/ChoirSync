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
import { verticalScale } from "@/utilities/TrueScale";
import { useHeaderHeight } from "@react-navigation/elements";
import { StatusBar } from "expo-status-bar";
import { globalStyles } from "@/shared/css/GlobalCss";
import { router, useLocalSearchParams } from "expo-router";
import LoadingButton from "@/components/LoadingButton";
import { emailAuthService } from "@/services/EmailAuthService";

const VerifyOtpPage = () => {
  const headerHeight = useHeaderHeight();
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { email } = useLocalSearchParams<{ email: string }>();

  const isValidOtp = (code: string) => {
    // Check for alphanumeric code with 6 characters
    return code.length === 6 && /^[a-zA-Z0-9]+$/.test(code);
  };

  const handleSubmit = async () => {
    if (!isValidOtp(otpCode)) {
      Alert.alert("Error", "Please enter a valid 6-character code");
      return;
    }

    setIsLoading(true);
    try {
      const result = await emailAuthService.verifyOtpCode(email, otpCode);

      if (result.success) {
        router.push({
          pathname: "/resetPassword",
          params: { email },
        });
      } else {
        Alert.alert("Error", result.message || "Failed to verify code");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to verify code");
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
            Verify Code
          </Text>

          <Text style={globalStyles.regularText}>
            Enter the 6-character verification code sent to your email.
          </Text>

          <TextInput
            style={[globalStyles.Input, { marginTop: verticalScale(32) }]}
            placeholder="6-character code"
            value={otpCode}
            onChangeText={setOtpCode}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="visible-password"
            maxLength={6}
            placeholderTextColor="#C9C8CA"
          />
        </View>

        <LoadingButton
          isLoading={isLoading}
          onPress={handleSubmit}
          buttonText="Verify Code"
          style={[globalStyles.Btn, globalStyles.BtnBlack]}
          textStyle={[globalStyles.btnText, { color: "#ffff" }]}
          backgroundColor="#313234"
          disabled={!isValidOtp(otpCode)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default VerifyOtpPage;
