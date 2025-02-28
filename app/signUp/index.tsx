import {
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Alert,
} from "react-native";
import React, { useState, useMemo } from "react";
import { verticalScale } from "@/utilities/TrueScale";
import { useHeaderHeight } from "@react-navigation/elements";
import { StatusBar } from "expo-status-bar";
import { globalStyles } from "@/shared/css/GlobalCss";
import { router } from "expo-router";
import { authService } from "@/services/AuthService";
import LoadingButton from "@/components/LoadingButton";
import { useLoadingState } from "@/hooks/useLoadingState";

const SignUpPage = () => {
  const headerHeight = useHeaderHeight();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useLoadingState(false);

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Check if form is valid using useMemo to prevent unnecessary recalculations
  const isFormValid = useMemo(() => {
    return isValidEmail(email) && password.length >= 1;
  }, [email, password]);

  const handleSignUp = async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please enter a valid email and password");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.signUp({
        email,
        password,
        firstName: "",
        lastName: "",
      });

      setIsLoading(false);

      if (result.success) {
        router.navigate("/name");
      } else {
        Alert.alert("Error", result.error || "Failed to sign up");
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", "An unexpected error occurred");
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
          <Text style={globalStyles.H1}>SignUp</Text>

          <TextInput
            style={globalStyles.Input}
            placeholder="Enter Email"
            placeholderTextColor="#C9C8CA"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <TextInput
            secureTextEntry={true}
            style={[globalStyles.Input, { marginTop: verticalScale(19.28) }]}
            placeholder="Enter Password"
            placeholderTextColor="#C9C8CA"
            value={password}
            onChangeText={setPassword}
            autoComplete="password"
          />
        </View>

        <LoadingButton
          isLoading={isLoading}
          onPress={handleSignUp}
          disabled={!isFormValid}
          loadingText="Signing up..."
          buttonText="Sign Up"
          style={[globalStyles.Btn, globalStyles.BtnBlack]}
          textStyle={[globalStyles.btnText, { color: "#ffff" }]}
          backgroundColor="#313234"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignUpPage;
