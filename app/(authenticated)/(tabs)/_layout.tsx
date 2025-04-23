import React, { useEffect } from "react";

import { useNavigation, Tabs, router } from "expo-router";

import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { StackActions } from "@react-navigation/native";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import HomeIcon from "@/assets/images/SVG/house-chimney.svg";
import CatalogIcon from "@/assets/images/SVG/folder-music.svg";
import { styles } from "@/shared/css/headingCss";
import { MiniPlayerProvider } from "@/contexts/MiniPlayerContext";
import { PaperProvider } from "react-native-paper";
import { NowPlayingComponent } from "@/components/NowPlayingComponent";
import { HeaderProfileImage } from "@/components/HeaderProfileImage";
import { PlatformPressable } from "@react-navigation/elements";
import { useUser } from "@/contexts/UserContext";
import CustomTabBar from "@/components/CustomTabBar";
import { useAuth } from "@/hooks/useAuth";
export default function TabLayout() {
  const navigation = useNavigation();
  const { getCurrentUserData } = useUser();
  const { getCurrentUser } = useAuth();

  const { groupId } = getCurrentUserData();
  useEffect(() => {
    const checkMembership = async () => {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        navigation.dispatch(StackActions.popToTop());
        return;
      }

      if (!groupId) {
        router.replace("/chooseYourGroup");
      }
    };

    checkMembership();
  }, []);

  return (
    <MiniPlayerProvider>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          tabBarActiveTintColor: "#8F8F8F",
          tabBarInactiveTintColor: "#C2C2C2",
          tabBarButton: (props) => (
            <PlatformPressable
              {...props}
              android_ripple={{ color: "transparent" }} // Disables the ripple effect for Android
            />
          ),
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

            headerTitleStyle: styles.headerTitle,
            headerRight: () => (
              <HeaderProfileImage
                onPress={() => router.push("/(authenticated)/(Settings)")}
                marginRight={horizontalScale(20)}
              />
            ),
            headerShadowVisible: false,
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
    </MiniPlayerProvider>
  );
}

const styles2 = StyleSheet.create({
  profilePic: {
    width: moderateScale(39),
    height: moderateScale(39),
    borderRadius: moderateScale(19.5),
    marginRight: moderateScale(20),
    marginBottom: verticalScale(1),
  },
});
