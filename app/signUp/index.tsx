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
import { styles } from "@/shared/css/signinLoginCss";
import { router } from "expo-router";
import { authService } from "@/services/AuthService";

const SignUpPage = () => {
  const headerHeight = useHeaderHeight();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

      if (result.success) {
        router.navigate("/name");
      } else {
        Alert.alert("Error", result.error || "Failed to sign up");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <TextInput
            secureTextEntry={true}
            style={[styles.Input, { marginTop: verticalScale(19.28) }]}
            placeholder="Enter Password"
            placeholderTextColor="#C9C8CA"
            value={password}
            onChangeText={setPassword}
            autoComplete="password"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.Btn,
            styles.BtnBlack,
            (!isFormValid || isLoading) && { opacity: 0.7 },
          ]}
          onPress={handleSignUp}
          disabled={!isFormValid || isLoading}
        >
          <Text style={[styles.btnText, { color: "#ffff" }]}>
            {isLoading ? "Signing up..." : "Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignUpPage;
