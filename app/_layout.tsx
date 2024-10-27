import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import BackButton from "@/assets/images/SVG/back-Button.svg";

import { useColorScheme } from "@/components/useColorScheme";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { horizontalScale } from "@/utilities/TrueScale";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Inter-ExtraBold": require("../assets/fonts/Inter-ExtraBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-Light": require("../assets/fonts/Inter-Light.ttf"),
    "Inter-ExtraLight": require("../assets/fonts/Inter-ExtraLight.ttf"),
    "Inter-Black": require("../assets/fonts/Inter-Black.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Thin": require("../assets/fonts/Inter-Thin.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* <Stack.Screen name="(tabs)" options={{ headerShown: false}} /> */}
      <Stack.Screen
        name="signUp/signUpOptions"
        options={{
          animation: "none",
          headerTransparent: true,
          headerTitle: "",
          headerBackTitleVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <BackButton></BackButton>
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="signUp/index"
        options={{
          animation: "none",
          headerTitle: "",
          headerBackTitleVisible: false,

          headerTransparent: true,

          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <BackButton style={styles.BackButton}></BackButton>
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="login/index"
        options={{
          animation: "none",
          headerTitle: "",
          headerBackTitleVisible: false,

          headerTransparent: true,

          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <BackButton style={styles.BackButton}></BackButton>
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="login/loginOptions"
        options={{
          animation: "none",
          headerTransparent: true,
          headerTitle: "",
          headerBackTitleVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <BackButton style={styles.BackButton}></BackButton>
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="name"
        options={{
          animation: "none",
          headerTransparent: true,
          headerTitle: "",
          headerBackTitleVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <BackButton style={styles.BackButton}></BackButton>
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="chooseYourPath"
        options={{
          animation: "none",
          headerTransparent: true,
          headerTitle: "",
          headerBackTitleVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <BackButton style={styles.BackButton}></BackButton>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  BackButton: {
    marginLeft: horizontalScale(0),
  },
});
