import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import "react-native-reanimated";
import { StyleSheet } from "react-native";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import {
  getTrackingPermissionsAsync,
  PermissionStatus,
  requestTrackingPermissionsAsync,
} from "expo-tracking-transparency";
import BackButtonComponent from "@/components/BackButtonComponent";
import { CurrentTrackProvider } from "@/contexts/CurrentTrackContext";
import NowPlayingComponent from "@/components/NowPlayingComponent";
import { Asset } from "expo-asset";
import { styles } from "@/shared/css/headingCss";
import { PaperProvider } from "react-native-paper";
import { RecordingsProvider } from "@/contexts/RecordingsContext";
import { NowPlayingProvider } from "@/contexts/NowPlayingContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { WebViewProvider } from "@/contexts/WebViewContext";
import { UserProvider } from "@/contexts/UserContext";
import { HeaderProfileImage } from "@/components/HeaderProfileImage";
import { AppStateProvider } from "@/contexts/AppStateContext";

import mobileAds, { AdsConsent } from "react-native-google-mobile-ads";
import { StatusBarProvider } from "@/contexts/StatusBarContext";
import { NewSongsProvider } from "@/contexts/newSongsContext";
import { SQLiteDatabase, SQLiteProvider, useSQLiteContext } from "expo-sqlite";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 300,
  fade: true,
});

// This can be used when we deep link to a route in our app
// or when we use the "withAnchor" prop in the router when
// Navigating to a route. This ensures that the initial route
// is loaded first before the navigation to the specified route.
// export const unstable_settings = {
//   // Ensure any route can link back to `/`
//   initialRouteName: "(authenticated)/(tabs)",
// };

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
  const hasTriedToInitializeAds = useRef(false);

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
        await preloadLocalImgAssets();
      } catch (error) {
        console.error(error);
      } finally {
        setIsReady(true);
        // SplashScreen.hideAsync();
      }
    }

    prepare();
    // NOTE: This is the full consent flow which includes UMP(User Messaging Platform)
    // and initialize ads.
    // AdsConsent.reset();
    runFullAdsConsentFlow();

    // NOTE: We attempt to load ads using UMP consent obtained in the previous session.
    // Its a way to skip the UMP flow if the user has already given consent.
    initializeAds();
  }, []);

  async function runFullAdsConsentFlow() {
    try {
      await umpFlow();
      await initializeAds();
    } catch (error) {
      console.error(`Error running full ads consent flow: ${error}`);
    }
  }
  /**
   * This function request consent to show both personalized and non-personalized ads
   * for users in the EU area. UMP(User Messaging Platform).
   */
  async function umpFlow() {
    await AdsConsent.gatherConsent();
  }

  async function initializeAds() {
    const { canRequestAds, status } = await AdsConsent.getConsentInfo();

    // Note: If user has not completed the UMP flow previously
    // canRequestAds will be false.
    if (!canRequestAds || hasTriedToInitializeAds.current) return;

    hasTriedToInitializeAds.current = true;

    // Ask IOS users for if they want to opt in to personalized ads
    // AdMob uses the outcome of this to determine
    // if it should show personalized ads or not ON IOS

    // NOTE: if an IOS user says no to personalized ads,
    // Google AdMob will still show non-personalized ads to the user.
    await getTrackingPermissionsForPersonalizedAdsOnIOS();

    mobileAds()
      .initialize()
      .then((adapterStatuses) => {
        // Initialization complete!
        console.log("Ads initialization complete!", adapterStatuses);
      })
      .catch((error) => {
        console.log("Ads initialization failed", error);
      });
  }

  async function getTrackingPermissionsForPersonalizedAdsOnIOS() {
    const { status } = await getTrackingPermissionsAsync();

    if (status === PermissionStatus.UNDETERMINED) {
      await requestTrackingPermissionsAsync();
    }
    return status;
  }

  if (!fontLoaded || !isReady) {
    return null;
  } else {
    return <RootLayoutNav />;
  }
}

async function createDbIfNeeded(db: SQLiteDatabase) {
  const result = await db.execAsync(
    "CREATE TABLE IF NOT EXISTS Songs (id INTEGER PRIMARY KEY AUTOINCREMENT, song_name TEXT, artist_name TEXT, link TEXT)"
  );
  console.log("DB created", result);
}

function RootLayoutNav() {
  return (
    <PaperProvider>
      <SQLiteProvider databaseName="ChoirSyncDB" onInit={createDbIfNeeded}>
        <StatusBarProvider>
          <AppStateProvider>
            <LoadingProvider>
              <UserProvider>
                <WebViewProvider>
                  <RecordingsProvider>
                    <CurrentTrackProvider>
                      <NewSongsProvider>
                        <NowPlayingProvider>
                          <NowPlayingComponent />
                          <Stack>
                            {/* Public routes */}
                            <Stack.Screen
                              name="index"
                              options={{ headerShown: false }}
                            />

                            <Stack.Screen
                              name="name"
                              options={{
                                animation: "none",
                                headerTransparent: true,
                                headerTitle: "",
                                headerBackButtonDisplayMode: "minimal",
                                headerBackVisible: false,
                              }}
                            />

                            <Stack.Screen
                              name="chooseYourPath"
                              options={{
                                animation: "none",
                                headerTransparent: true,
                                headerTitle: "",
                                headerBackButtonDisplayMode: "minimal",
                                headerLeft: () => (
                                  <BackButtonComponent
                                    style={styles2.BackButton}
                                  />
                                ),
                              }}
                            />

                            <Stack.Screen
                              name="chooseYourGroup"
                              options={{
                                animation: "none",
                                headerTransparent: true,
                                headerTitle: "",
                                headerBackButtonDisplayMode: "minimal",
                                headerLeft: () => (
                                  <BackButtonComponent
                                    style={styles2.BackButton}
                                  />
                                ),
                              }}
                            />

                            <Stack.Screen
                              name="inviteCode"
                              options={{
                                animation: "none",
                                headerTransparent: true,
                                headerBackButtonDisplayMode: "minimal",
                                headerLeft: () => (
                                  <BackButtonComponent
                                    style={styles2.BackButton}
                                  />
                                ),
                              }}
                            />

                            {/* Authenticated routes */}
                            <Stack.Screen
                              name="(authenticated)/(tabs)"
                              options={{
                                headerShown: false,
                                animation: "slide_from_right",
                                gestureEnabled: false,
                              }}
                            />
                            <Stack.Screen
                              name="(authenticated)/(Settings)/index"
                              options={{
                                headerShown: true,
                                animation: "slide_from_right",
                                headerTitle: "Settings",
                                headerTitleAlign: "center",
                                headerTitleStyle: styles.headerTitle,
                                headerShadowVisible: false,
                                headerBackButtonDisplayMode: "minimal",
                                headerLeft: () => <BackButtonComponent />,

                                headerRight: () => (
                                  <HeaderProfileImage
                                    disabled={true}
                                    onPress={() => null}
                                    marginRight={0}
                                    marginLeft={0}
                                  />
                                ),
                              }}
                            />
                            <Stack.Screen
                              name="(authenticated)/(Settings)/profile"
                              options={{
                                headerShown: true,
                                animation: "none",
                                headerTitle: "Account profile",
                                headerTitleAlign: "center",
                                headerTitleStyle: styles.headerTitle,
                                headerShadowVisible: false,
                                headerBackButtonDisplayMode: "minimal",
                                headerLeft: () => <BackButtonComponent />,
                                headerRight: () => (
                                  <HeaderProfileImage
                                    disabled={true}
                                    onPress={() => null}
                                    marginRight={0}
                                    marginLeft={0}
                                  />
                                ),
                              }}
                            />
                            <Stack.Screen
                              name="(authenticated)/(Settings)/editUser"
                              options={{
                                animation: "none",
                                headerTransparent: true,
                                headerTitle: "",
                                headerBackButtonDisplayMode: "minimal",
                                headerLeft: () => (
                                  <BackButtonComponent
                                    style={styles2.BackButton}
                                  />
                                ),
                              }}
                            />
                            <Stack.Screen
                              name="(authenticated)/(Settings)/notifications"
                              options={{
                                headerShown: true,
                                animation: "none",
                                headerTitle: "Notifications",
                                headerTitleAlign: "center",
                                headerTitleStyle: styles.headerTitle,
                                headerShadowVisible: false,
                                headerBackButtonDisplayMode: "minimal",
                                headerLeft: () => <BackButtonComponent />,
                                headerRight: () => (
                                  <HeaderProfileImage
                                    disabled={true}
                                    onPress={() => null}
                                    marginRight={0}
                                    marginLeft={0}
                                  />
                                ),
                              }}
                            />
                            <Stack.Screen
                              name="(authenticated)/recordings"
                              options={{
                                headerShown: true,
                                animation: "slide_from_right",
                                headerTitle: "This Week's Recordings",
                                headerTitleAlign: "center",
                                headerTitleStyle: styles.smallHeaderTitle,
                                headerShadowVisible: false,
                                headerBackButtonDisplayMode: "minimal",
                                headerLeft: () => <BackButtonComponent />,
                              }}
                            />
                            <Stack.Screen
                              name="(authenticated)/newSongs"
                              options={{
                                headerShown: true,
                                animation: "slide_from_right",
                                headerTitle: "New Songs",
                                headerTitleAlign: "center",
                                headerTitleStyle: styles.smallHeaderTitle,
                                headerShadowVisible: false,
                                headerBackButtonDisplayMode: "minimal",
                                headerLeft: () => <BackButtonComponent />,
                              }}
                            />
                            <Stack.Screen
                              name="(authenticated)/savedSongs"
                              options={{
                                headerShown: true,
                                animation: "slide_from_right",
                                headerTitle: "Saved Songs",
                                headerTitleAlign: "center",
                                headerTitleStyle: styles.smallHeaderTitle,
                                headerShadowVisible: false,
                                headerBackButtonDisplayMode: "minimal",
                                headerLeft: () => <BackButtonComponent />,
                              }}
                            />
                          </Stack>
                        </NowPlayingProvider>
                      </NewSongsProvider>
                    </CurrentTrackProvider>
                  </RecordingsProvider>
                </WebViewProvider>
              </UserProvider>
            </LoadingProvider>
          </AppStateProvider>
        </StatusBarProvider>
      </SQLiteProvider>
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
