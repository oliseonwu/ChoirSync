import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { moderateScale, verticalScale } from "@/utilities/TrueScale";
import { useHeaderHeight } from "@react-navigation/elements";
import { StatusBar } from "expo-status-bar";
import { globalStyles } from "@/shared/css/GlobalCss";
import { router, useLocalSearchParams } from "expo-router";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import LoadingButton from "@/components/LoadingButton";
import { inviteCodeService } from "@/services/InviteCodeService";
import Parse from "@/services/Parse";

const InviteCodePage = () => {
  const headerHeight = useHeaderHeight();
  const { groupName, groupId } = useLocalSearchParams<{
    groupName: string;
    groupId: string;
  }>();
  const navigation = useNavigation();
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: groupName || "",
      headerTitleAlign: "center",
      headerTitleStyle: {
        fontFamily: "Inter-Regular",
        fontSize: moderateScale(14),
        color: "#595959",
      },
    });
  }, [navigation, groupName]);

  const handleValidateCode = async () => {
    if (!inviteCode.trim()) {
      Alert.alert("Error", "Please enter an invite code");
      return;
    }

    setIsLoading(true);
    try {
      const validationResult = await inviteCodeService.validateInviteCode(
        inviteCode,
        groupId
      );

      if (validationResult.success) {
        const currentUser = await Parse.User.currentAsync();
        if (!currentUser) {
          Alert.alert("Error", "You must be logged in to join a group");
          return;
        }

        const addUserResult = await inviteCodeService.addUserToChoirGroup(
          groupId,
          currentUser.id
        );

        if (addUserResult.success) {
          router.navigate("/(tabs)");
        } else {
          Alert.alert("Error", "Failed to join the group");
        }
      } else {
        Alert.alert("Error", validationResult.error || "Invalid invite code");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to validate invite code");
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
            Enter Invite Code
          </Text>

          <Text style={globalStyles.regularText}>
            Enter the invite code you received from the group creator.
          </Text>

          <TextInput
            style={[globalStyles.Input, { marginTop: verticalScale(32) }]}
            placeholder="Enter Invite Code"
            value={inviteCode}
            onChangeText={setInviteCode}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={6}
            placeholderTextColor="#C9C8CA"
          />
        </View>

        <LoadingButton
          isLoading={isLoading}
          onPress={handleValidateCode}
          buttonText="Join Group"
          style={[globalStyles.Btn, globalStyles.BtnBlack]}
          textStyle={[globalStyles.btnText, { color: "#ffff" }]}
          backgroundColor="#313234"
          disabled={!inviteCode.trim()}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InviteCodePage;
