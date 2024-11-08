import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useMemo } from "react";
import {
  getWindowSize,
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import { useHeaderHeight } from "@react-navigation/elements";
import { StatusBar } from "expo-status-bar";
import { styles } from "@/shared/css/signinLoginCss";
import { router } from "expo-router";
import { authService } from "@/services/AuthService";
import Parse from "@/services/Parse";
import { useNavigation, StackActions } from "@react-navigation/native";
import LoadingButton from "@/components/LoadingButton";
import { useLoadingState } from "@/hooks/useLoadingState";

const NamePage = () => {
  const headerHeight = useHeaderHeight();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useLoadingState(false);
  const navigation = useNavigation();

  // Validate form using useMemo to prevent unnecessary recalculations
  const isFormValid = useMemo(() => {
    return firstName.length >= 1 && lastName.length >= 1;
  }, [firstName, lastName]);

  const updateUserProfile = async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please enter both first and last name");
      return;
    }

    setIsLoading(true);

    try {
      const currentUser = await Parse.User.currentAsync();
      console.log(currentUser);
      if (!currentUser) {
        Alert.alert("Oops!", "You are not logged in. Please login.", [
          {
            text: "OK",
            onPress: () => navigation.dispatch(StackActions.popToTop()),
          },
        ]);
        return;
      }

      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();

      // Destructure attributes once
      const { firstName: currentFirstName, lastName: currentLastName } =
        currentUser.attributes;

      const namesAreSame =
        trimmedFirstName === currentFirstName &&
        trimmedLastName === currentLastName;

      // Only update if names have changed
      if (!namesAreSame) {
        currentUser.set("firstName", trimmedFirstName);
        currentUser.set("lastName", trimmedLastName);
        await currentUser.save();
      }

      setIsLoading(false);

      router.navigate("/chooseYourPath");
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert("Error", error.message || "Failed to update profile");
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
          <Text style={[styles.H1, { marginBottom: verticalScale(32) }]}>
            Tell us about yourself
          </Text>
          <Text
            style={[styles.regularText, { paddingBottom: verticalScale(34) }]}
          >
            Please enter your legal name below
          </Text>

          <TextInput
            style={styles.Input}
            placeholder="First Name"
            placeholderTextColor="#C9C8CA"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            autoComplete="name-given"
          />

          <TextInput
            style={[styles.Input, { marginTop: verticalScale(19.28) }]}
            placeholder="Last Name"
            placeholderTextColor="#C9C8CA"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            autoComplete="name-family"
          />
        </View>

        <LoadingButton
          isLoading={isLoading}
          onPress={updateUserProfile}
          disabled={!isFormValid}
          loadingText="Saving..."
          buttonText="Next"
          style={[styles.Btn, styles.BtnBlack]}
          textStyle={[styles.btnText, { color: "#ffff" }]}
          backgroundColor="#313234"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NamePage;
