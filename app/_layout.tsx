import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import BackButton from "@/assets/images/SVG/back-Button.svg";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import BackButtonComponent from "@/components/BackButtonComponent";
import { MiniPlayerProvider } from "@/contexts/MiniPlayerContext";
import { CurrentTrackProvider } from "@/contexts/CurrentTrackContext";
import NowPlayingComponent from "@/components/NowPlayingComponent";
import { Asset } from "expo-asset";
import { styles } from "@/shared/css/headingCss";
import { PaperProvider } from "react-native-paper";
import { RecordingsProvider } from "@/contexts/RecordingsContext";
import { NowPlayingProvider } from "@/contexts/NowPlayingContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

type LoginScreenParams = {
  params?: {
    isLoading?: string;
  };
};

export default function RootLayout() {
  const [fontLoaded, error] = useFonts({
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

  const [isReady, setIsReady] = useState(false);

  const preloadLocalImgAssets = async () => {
    try {
      const images = [
        require("@/assets/images/landing-Page.png"),
        require("@/assets/images/login-option-landing-image.png"),
      ];

      const cacheImages = images.map((image) => {
        return Asset.loadAsync(image);
      });

      await Promise.all(cacheImages);
    } catch (error) {
      console.error("Error preloading images:", error);
    }
  };

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    async function prepare() {
      try {
        SplashScreen.preventAutoHideAsync();
        await preloadLocalImgAssets();
      } catch (error) {
        console.error(error);
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!fontLoaded || !isReady) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <PaperProvider>
      <RecordingsProvider>
        <CurrentTrackProvider>
          <NowPlayingProvider>
            <NowPlayingComponent />
            <Stack>
              {/* Public routes */}
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="signUp/index"
                options={({ route }: { route: LoginScreenParams }) => ({
                  animation: "none",
                  headerTransparent: true,
                  headerTitle: "",
                  headerBackTitleVisible: false,
                  headerLeft: () => (
                    <BackButtonComponent
                      isLoading={route.params?.isLoading === "true"}
                      style={styles2.BackButton}
                    />
                  ),
                })}
              />

              <Stack.Screen
                name="signUp/signUpOptions"
                options={{
                  animation: "none",
                  headerTransparent: true,
                  headerTitle: "",
                  headerBackTitleVisible: false,
                  headerLeft: () => (
                    <BackButtonComponent style={styles2.BackButton} />
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
                    <BackButtonComponent style={styles2.BackButton} />
                  ),
                }}
              />

              <Stack.Screen
                name="login/index"
                options={({ route }: { route: LoginScreenParams }) => ({
                  animation: "none",
                  headerTransparent: true,
                  headerTitle: "",
                  headerBackTitleVisible: false,
                  headerLeft: () => (
                    <BackButtonComponent
                      isLoading={route.params?.isLoading === "true"}
                      style={styles2.BackButton}
                    />
                  ),
                })}
              />

              <Stack.Screen
                name="name"
                options={{
                  animation: "none",
                  headerTransparent: true,
                  headerTitle: "",
                  headerBackTitleVisible: false,
                  headerLeft: () => (
                    <BackButtonComponent style={styles2.BackButton} />
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
                    <BackButtonComponent style={styles2.BackButton} />
                  ),
                }}
              />

              <Stack.Screen
                name="chooseYourGroup"
                options={{
                  animation: "none",
                  headerTransparent: true,
                  headerTitle: "",
                  headerBackTitleVisible: false,
                  headerLeft: () => (
                    <BackButtonComponent style={styles2.BackButton} />
                  ),
                }}
              />

              <Stack.Screen
                name="inviteCode"
                options={{
                  animation: "none",
                  headerTransparent: true,
                  headerBackTitleVisible: false,
                  headerLeft: () => (
                    <BackButtonComponent style={styles2.BackButton} />
                  ),
                }}
              />

              {/* Authenticated routes */}
              <Stack.Screen
                name="(authenticated)/(tabs)"
                options={{
                  headerShown: false,
                  animation: "none",
                }}
              />
              <Stack.Screen
                name="(authenticated)/settings"
                options={{
                  headerShown: true,
                  animation: "fade",
                  headerTitle: "Settings",
                  headerTitleAlign: "center",
                  headerTitleStyle: styles.headerTitle,
                  headerShadowVisible: false,

                  headerBackTitleVisible: false,
                  headerLeft: () => <BackButtonComponent />,

                  headerRight: () => (
                    <TouchableOpacity activeOpacity={0.7} disabled>
                      <Image
                        source={require("@/assets/images/profile-placeholder.png")}
                        style={styles.profilePic}
                      />
                    </TouchableOpacity>
                  ),
                }}
              />
              <Stack.Screen
                name="(authenticated)/recordings"
                options={{
                  headerShown: true,
                  animation: "fade",
                  headerTitle: "This Week's Recordings",
                  headerTitleAlign: "center",
                  headerTitleStyle: styles.smallHeaderTitle,
                  headerShadowVisible: false,
                  headerBackTitleVisible: false,
                  headerLeft: () => <BackButtonComponent />,
                }}
              />
            </Stack>
          </NowPlayingProvider>
        </CurrentTrackProvider>
      </RecordingsProvider>
    </PaperProvider>
  );
}
const styles2 = StyleSheet.create({
  BackButton: {
    marginLeft: horizontalScale(0),
  },
  profilePic: {
    width: moderateScale(39),
    height: moderateScale(39),
    borderRadius: moderateScale(19.5),
    marginRight: moderateScale(0),
    marginBottom: verticalScale(1),
  },
});
