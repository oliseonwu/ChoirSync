import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { styles } from "@/shared/css/headingCss";
import { useUser } from "@/contexts/UserContext";

interface HeaderProfileImageProps {
  onPress: () => void;
  marginRight?: number;
  marginLeft?: number;
  disabled?: boolean;
}

export const HeaderProfileImage = ({
  onPress,
  marginRight,
  marginLeft,
  disabled = false,
}: HeaderProfileImageProps) => {
  const { getCurrentUserData } = useUser();
  const userData = getCurrentUserData();

  const generateCountColorBasedOnName = () => {
    const firstLetter = userData.firstName?.charAt(0).toLowerCase();
    const color = `#${firstLetter?.charCodeAt(0).toString(16).padStart(2, "0")}`;
    return color;
  };

  const profileImage = useMemo(() => {
    if (userData.profileImageUrl) {
      return (
        <Image
          source={{ uri: userData.profileImageUrl }}
          style={[
            styles.profilePic,
            { marginRight: marginRight, marginLeft: marginLeft },
          ]}
        />
      );
    }

    return (
      <View
        style={[
          styles.profilePic,
          {
            marginRight: marginRight,
            marginLeft: marginLeft,
            backgroundColor: "#E6E9E8",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text>
          {userData.firstName?.charAt(0)}
          {userData.lastName?.charAt(0)}
        </Text>
      </View>
    );
  }, [userData.profileImageUrl]);

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} disabled={disabled}>
      {profileImage}
    </TouchableOpacity>
  );
};
