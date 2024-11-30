import { Stack } from "expo-router";
import { moderateScale } from "@/utilities/TrueScale";
import BackButtonComponent from "@/components/BackButtonComponent";
import { TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { styles } from "@/shared/css/headingCss";

export default function AuthenticatedLayout() {
  return (
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
          animation: "none",
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
    </Stack>
  );
}
