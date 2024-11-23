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
import LoadingButton from "@/components/LoadingButton";
import { useLoadingState } from "@/hooks/useLoadingState";

const LoginPage = () => {
  const headerHeight = useHeaderHeight();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useLoadingState(false);

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

  type UserStatus = {
    hasName: boolean;
    isMemberOfAnyChoir: boolean;
  };

  const getUserStatus = async (user: Parse.User): Promise<UserStatus> => {
    const firstName = user.get("firstName");
    const lastName = user.get("lastName");
    const hasName = Boolean(firstName && lastName);

    const membershipResult = await authService.checkChoirMembership(user.id);
    if (!membershipResult.success) {
      throw new Error(
        membershipResult.error || "Failed to check choir membership"
      );
    }

    return {
      hasName,
      isMemberOfAnyChoir: membershipResult.isMember,
    };
  };

  const navigateBasedOnUserStatus = (userStatus: UserStatus) => {
    if (!userStatus.hasName) {
      return router.navigate("/name");
    }
    return userStatus.isMemberOfAnyChoir
      ? setTimeout(() => router.navigate("/(tabs)"), 300)
      : setTimeout(() => router.navigate("/chooseYourPath"), 300);
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

  const handleLoginError = (error: any) => {
    console.error("Login error:", error);

    const message = error.message?.includes("Invalid username/password")
      ? "The email or password you entered is incorrect."
      : "An unexpected error occurred. Please try again.";

    Alert.alert("Oops!", message, [{ text: "OK" }]);
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      // Login flow
      const user = await validateAndLogin();
      const userStatus = await getUserStatus(user);

      // Complete login
      setIsLoading(false);

      navigateBasedOnUserStatus(userStatus);
    } catch (error: any) {
      setIsLoading(false);
      handleLoginError(error);
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

        <LoadingButton
          isLoading={isLoading}
          onPress={handleLogin}
          disabled={!isFormValid}
          loadingText="Logging in..."
          buttonText="Login"
          style={[styles.Btn, styles.BtnBlack]}
          textStyle={[styles.btnText, { color: "#ffff" }]}
          backgroundColor="#313234"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginPage;
