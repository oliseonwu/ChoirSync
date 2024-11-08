import {
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  Alert,
} from "react-native";
import React, { useState, useMemo } from "react";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import { useHeaderHeight } from "@react-navigation/elements";
import { StatusBar } from "expo-status-bar";
import { styles } from "@/shared/css/signinLoginCss";
import { router } from "expo-router";
import { authService } from "@/services/AuthService";

const LoginPage = () => {
  const headerHeight = useHeaderHeight();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Check if form is valid using useMemo
  // to prevent unnecessary recalculations
  const isFormValid = useMemo(() => {
    return isValidEmail(email) && password.length >= 1;
  }, [email, password]);

  const handleMembershipCheck = async (user: Parse.User) => {
    const membershipResult = await authService.checkChoirMembership(user.id);

    if (!membershipResult.success) {
      throw new Error(
        membershipResult.error || "Failed to check choir membership"
      );
    }

    return membershipResult.isMember
      ? router.navigate("/(tabs)")
      : router.navigate("/chooseYourPath");
  };

  const validateAndLogin = async () => {
    if (!isFormValid) {
      throw new Error("Please enter a valid email and password");
    }

    const result = await authService.login({ email, password });

    if (!result.success || !result.user) {
      throw new Error(result.error || "Failed to login");
    }

    return result.user;
  };

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const user = await validateAndLogin();
      await handleMembershipCheck(user);
    } catch (error: any) {
      Alert.alert("Error", error.message || "An unexpected error occurred");
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
          <Text style={styles.H1}>Login</Text>

          <TextInput
            style={styles.Input}
            placeholder="Enter Email"
            placeholderTextColor="#C9C8CA"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress" // for iOS
            inputMode="email" // for better keyboard layout
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
          onPress={handleLogin}
          disabled={!isFormValid || isLoading}
        >
          <Text style={[styles.btnText, { color: "#ffff" }]}>
            {isLoading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginPage;
