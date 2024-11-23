import React, { useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation, Redirect, Link, Tabs, router } from "expo-router";

import { Pressable, StyleSheet, TouchableOpacity } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { authService } from "@/services/AuthService";
import { StackActions } from "@react-navigation/native";
import { Image } from "expo-image";
import { moderateScale, verticalScale } from "@/utilities/TrueScale";
import HomeIcon from "@/assets/images/SVG/house-chimney.svg";
import CatalogIcon from "@/assets/images/SVG/folder-music.svg";
// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  useEffect(() => {
    const checkMembership = async () => {
      const currentUser = await authService.getCurrentUser();

      if (!currentUser) {
        navigation.dispatch(StackActions.popToTop());
        return;
      }

      const membershipResult = await authService.checkChoirMembership(
        currentUser.id
      );

      if (!membershipResult.success || !membershipResult.isMember) {
        router.replace("/chooseYourPath");
      }
    };

    checkMembership();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#8F8F8F",
        tabBarInactiveTintColor: "#C2C2C2",
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
        tabBarLabelStyle: {
          fontFamily: "Inter-Medium",
          fontSize: moderateScale(11),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <HomeIcon
              fill={color}
              width={verticalScale(24)}
              height={verticalScale(24)}
            />
          ),
          headerShown: true,
          headerTitleStyle: {
            fontFamily: "Inter-SemiBold",
            color: "#3E3C48",
          },
          headerRight: () => (
            <TouchableOpacity activeOpacity={0.7}>
              <Image
                source={require("@/assets/images/profile-placeholder.png")}
                style={styles.profilePic}
              />
            </TouchableOpacity>
          ),
          headerShadowVisible: true,
          headerStyle: {
            shadowColor: "transparent", // Remove shadow on Android and iOS
          },
        }}
      />
      <Tabs.Screen
        name="catalogue"
        options={{
          title: "Catalogue",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <CatalogIcon
              fill={color}
              width={verticalScale(24)}
              height={verticalScale(24)}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  profilePic: {
    width: moderateScale(39),
    height: moderateScale(39),
    borderRadius: moderateScale(19.5),
    marginRight: moderateScale(20),
    marginBottom: verticalScale(1),
  },
});
