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
import { router } from "expo-router";
import LoadingButton from "@/components/LoadingButton";
import Parse from "@/services/Parse";
import { useUser } from "@/contexts/UserContext";

export default function ChangePassword() {
  const headerHeight = useHeaderHeight();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getCurrentUserData } = useUser();
  const currentUserData = getCurrentUserData();

  const handleSubmit = async () => {
    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // Use Parse directly to change password for the current user
      const user = Parse.User.current();
      if (!user) {
        throw new Error("No user is currently logged in");
      }

      // Get email from the user object
      const userEmail = user.get("email");
      if (!userEmail) {
        throw new Error("User email not found");
      }

      // Verify current password by attempting to log in
      await Parse.User.logIn(userEmail, currentPassword);

      // Set the new password
      user.setPassword(newPassword);
      await user.save();

      Alert.alert("Success", "Your password has been changed successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to change password");
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
          {/* <Text style={[globalStyles.H1, { marginBottom: verticalScale(32) }]}>
            Tell us about yourself
          </Text>
          <Text
            style={[
              globalStyles.regularText,
              { paddingBottom: verticalScale(34) },
            ]}
          >
            Please enter your legal name below
          </Text> */}

          <Text style={[globalStyles.H1, { marginBottom: verticalScale(32) }]}>
            Change Password
          </Text>
          <Text
            style={[
              globalStyles.regularText,
              { paddingBottom: verticalScale(34) },
            ]}
          >
            Enter your current password and choose a new password.
          </Text>

          <TextInput
            style={globalStyles.Input}
            placeholder="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#C9C8CA"
          />

          <TextInput
            style={[globalStyles.Input, { marginTop: verticalScale(16) }]}
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
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
            placeholderTextColor="#C9C8CA"
          />
        </View>

        <LoadingButton
          isLoading={isLoading}
          onPress={handleSubmit}
          buttonText="Update Password"
          style={[globalStyles.Btn, globalStyles.BtnBlack]}
          textStyle={[globalStyles.btnText, { color: "#ffff" }]}
          backgroundColor="#313234"
          disabled={
            !currentPassword ||
            newPassword.length < 6 ||
            newPassword !== confirmPassword
          }
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
