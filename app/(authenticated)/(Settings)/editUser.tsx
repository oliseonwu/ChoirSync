import {
  StyleSheet,
  Text,
  TextInput,
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
import { globalStyles } from "@/shared/css/GlobalCss";
import { router, useLocalSearchParams } from "expo-router";
import { userManagementService } from "@/services/UserManagementService";
import Parse from "@/services/Parse";
import LoadingButton from "@/components/LoadingButton";
import { useLoadingState } from "@/hooks/useLoadingState";

type EditUserParams = {
  type: "firstName" | "lastName";
  title: string;
  description: string;
};

const EditUserPage = () => {
  const headerHeight = useHeaderHeight();
  const params = useLocalSearchParams<EditUserParams>();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useLoadingState(false);

  const isFormValid = useMemo(() => {
    return name.length >= 1;
  }, [name]);

  const updateName = async () => {
    let result;
    if (!isFormValid) {
      Alert.alert("Error", "Please enter a " + params.type);
      return;
    }

    setIsLoading(true);

    result = await userManagementService.updateUserField(params.type, name);

    if (!result.success) {
      router.dismissAll();
      Alert.alert("Error", result.error);
      return;
    }

    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[
          globalStyles.container,
          { paddingTop: verticalScale(headerHeight) },
        ]}
      >
        <StatusBar style="dark" />

        <View style={globalStyles.TopContainer}>
          <Text style={[globalStyles.H1, { marginBottom: verticalScale(32) }]}>
            {params.title}
          </Text>
          <Text
            style={[
              globalStyles.regularText,
              { paddingBottom: verticalScale(34) },
            ]}
          >
            {params.description}
          </Text>

          <TextInput
            style={globalStyles.Input}
            placeholder={
              params.type === "firstName" ? "First Name" : "Last Name"
            }
            placeholderTextColor="#C9C8CA"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoComplete={
              params.type === "firstName" ? "name-given" : "name-family"
            }
          />
        </View>

        <LoadingButton
          isLoading={isLoading}
          onPress={updateName}
          disabled={!isFormValid}
          loadingText="Saving..."
          buttonText="Save"
          style={[globalStyles.Btn, globalStyles.BtnBlack]}
          textStyle={[globalStyles.btnText, { color: "#ffff" }]}
          backgroundColor="#313234"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EditUserPage;
