import { Stack } from "expo-router";
import { moderateScale } from "@/utilities/TrueScale";
import BackButtonComponent from "@/components/BackButtonComponent";
import { TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { styles } from "@/shared/css/headingCss";
import { PaperProvider } from "react-native-paper";
import { RecordingsProvider } from "@/contexts/RecordingsContext";
import { CurrentTrackProvider } from "@/contexts/CurrentTrackContext";
import { NowPlayingProvider } from "@/contexts/NowPlayingContext";
import { NowPlayingComponent } from "@/components/NowPlayingComponent";

export default function AuthenticatedLayout() {
  return (
    <PaperProvider>
      <RecordingsProvider>
        <CurrentTrackProvider>
          <NowPlayingProvider>
            <Stack screenOptions={{ headerShown: false, animation: "none" }}>
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                  animation: "none",
                }}
              />
              <Stack.Screen
                name="settings"
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
                name="recordings"
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
            <NowPlayingComponent />
          </NowPlayingProvider>
        </CurrentTrackProvider>
      </RecordingsProvider>
    </PaperProvider>
  );
}
