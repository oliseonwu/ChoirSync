import React from "react";
import { TouchableOpacity } from "react-native";
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

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} disabled={disabled}>
      <Image
        source={
          userData.profileImageUrl
            ? { uri: userData.profileImageUrl }
            : require("@/assets/images/profile-placeholder.png")
        }
        style={[
          styles.profilePic,
          { marginRight: marginRight, marginLeft: marginLeft },
        ]}
      />
    </TouchableOpacity>
  );
};
