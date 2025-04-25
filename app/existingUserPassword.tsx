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
import { Link, router, useLocalSearchParams } from "expo-router";
import LoadingButton from "@/components/LoadingButton";
import { useAuth } from "@/hooks/useAuth";
import { emailAuthService } from "@/services/EmailAuthService";

const ExistingUserPasswordPage = () => {
  const headerHeight = useHeaderHeight();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { email } = useLocalSearchParams<{ email: string }>();
  const { performLogin } = useAuth();

  const isValidPassword = (password: string) => {
    return password.length >= 6; // Basic validation, adjust as needed
  };

  const handleSubmit = async () => {
    if (!isValidPassword(password)) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    await performLogin("email", email, password);
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
            Enter Your Password
          </Text>

          <Text style={globalStyles.regularText}>
            Please enter your password to sign in to your account.
          </Text>

          <TextInput
            style={[globalStyles.Input, { marginTop: verticalScale(32) }]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            placeholderTextColor="#C9C8CA"
          />
        </View>

        <Link style={styles.forgotPasswordLink} href="/forgotPassword">
          <Text style={[globalStyles.regularText, styles.forgotPasswordText]}>
            Forgot your password?
          </Text>
        </Link>
        <LoadingButton
          isLoading={isLoading}
          onPress={handleSubmit}
          buttonText="Sign In"
          style={[globalStyles.Btn, globalStyles.BtnBlack]}
          textStyle={[globalStyles.btnText, { color: "#ffff" }]}
          backgroundColor="#313234"
          disabled={!isValidPassword(password)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  forgotPasswordLink: {
    marginBottom: verticalScale(12),
  },
  forgotPasswordText: {
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default ExistingUserPasswordPage;
