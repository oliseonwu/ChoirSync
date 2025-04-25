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
import { useAuth } from "@/hooks/useAuth";

const ResetPasswordPage = () => {
  const headerHeight = useHeaderHeight();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { email } = useLocalSearchParams<{ email: string }>();
  const { performLogout } = useAuth();

  const isValidPassword = (password: string) => {
    return password.length >= 6; // Basic validation, adjust as needed
  };

  const handleSubmit = async () => {
    if (!isValidPassword(password)) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const result = await emailAuthService.resetPassword(email, password);

      if (result.success) {
        Alert.alert("Success", "Your password has been reset successfully.", [
          { text: "Sign In", onPress: performLogout },
        ]);
      } else {
        Alert.alert("Error", result.message || "Failed to reset password");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to reset password");
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
            Reset Password
          </Text>

          <Text style={globalStyles.regularText}>
            Create a new password for your account.
          </Text>

          <TextInput
            style={[globalStyles.Input, { marginTop: verticalScale(32) }]}
            placeholder="New Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
            placeholderTextColor="#C9C8CA"
          />

          <TextInput
            style={[globalStyles.Input, { marginTop: verticalScale(16) }]}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
            placeholderTextColor="#C9C8CA"
          />
        </View>

        <LoadingButton
          isLoading={isLoading}
          onPress={handleSubmit}
          buttonText="Reset Password"
          style={[globalStyles.Btn, globalStyles.BtnBlack]}
          textStyle={[globalStyles.btnText, { color: "#ffff" }]}
          backgroundColor="#313234"
          disabled={!isValidPassword(password) || password !== confirmPassword}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ResetPasswordPage;
