import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Portal } from "react-native-paper";

export default function ytVideoPage() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Olise",
    });
  }, []);

  return (
    <View>
      <Text>ytVideoPagedsfkjfsfgfdgdfgdsffsd</Text>
    </View>
  );
}
