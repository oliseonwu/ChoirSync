import React, { useEffect } from "react";

import { useNavigation, Tabs, router } from "expo-router";

import { StyleSheet, TouchableOpacity, View } from "react-native";
import { authService } from "@/services/AuthService";
import { StackActions } from "@react-navigation/native";
import { Image } from "expo-image";
import { moderateScale, verticalScale } from "@/utilities/TrueScale";
import HomeIcon from "@/assets/images/SVG/house-chimney.svg";
import CatalogIcon from "@/assets/images/SVG/folder-music.svg";
import { styles } from "@/shared/css/headingCss";
import { MiniPlayerProvider } from "@/contexts/MiniPlayerContext";
import { PaperProvider } from "react-native-paper";
import { NowPlayingComponent } from "@/components/NowPlayingComponent";

export default function TabLayout() {
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
    <PaperProvider>
      <MiniPlayerProvider>
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

              headerTitleStyle: styles.headerTitle,
              headerRight: () => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push("/(Settings)")}
                >
                  <Image
                    source={require("@/assets/images/profile-placeholder.png")}
                    style={styles2.profilePic}
                  />
                </TouchableOpacity>
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
    </PaperProvider>
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
