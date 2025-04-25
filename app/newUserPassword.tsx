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
import { router, useLocalSearchParams } from "expo-router";
import LoadingButton from "@/components/LoadingButton";
import { emailAuthService } from "@/services/EmailAuthService";
import { useAuth } from "@/hooks/useAuth";
const NewUserPasswordPage = () => {
  const headerHeight = useHeaderHeight();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { email } = useLocalSearchParams<{ email: string }>();
  const { performEmailSignUp } = useAuth();
  const isValidPassword = (password: string) => {
    return password.length >= 6; // Basic validation, adjust as needed
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!isValidPassword(password)) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    await performEmailSignUp(email, password);
    setIsLoading(false);
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
            Create Password
          </Text>

          <Text style={globalStyles.regularText}>
            Create a secure password for your new account.
          </Text>

          <TextInput
            style={[globalStyles.Input, { marginTop: verticalScale(32) }]}
            placeholder="Password"
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
            placeholder="Confirm Password"
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
          buttonText="Create Account"
          style={[globalStyles.Btn, globalStyles.BtnBlack]}
          textStyle={[globalStyles.btnText, { color: "#ffff" }]}
          backgroundColor="#313234"
          disabled={!isValidPassword(password) || password !== confirmPassword}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NewUserPasswordPage;
