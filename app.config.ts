import { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "ChoirSync",
  slug: "ChoirSync",
  version: "1.0.4",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "exp+choirsync",
  userInterfaceStyle: "automatic",
  platforms: ["ios", "android"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.olise.ChoirSync",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    icon: {
      light: "./assets/images/app-icons/ios-light.png",
      dark: "./assets/images/app-icons/ios-dark.png",
      tinted: "./assets/images/app-icons/ios-tinted.png",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    usesAppleSignIn: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/app-icons/adaptive-icon.png",
      monochromeImage: "./assets/images/app-icons/adaptive-icon.png",
      backgroundColor: "#FCF5F3",
    },
    softwareKeyboardLayoutMode: "pan",
    package: "com.olise.ChoirSync",
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
    permissions: [
      "com.google.android.gms.permission.AD_ID",
      "com.google.android.gms.permission.AD_ID",
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#FCF5F3",
        image: "./assets/images/app-icons/splash-icon-light.png",
        imageWidth: 200,
        resizeMode: "contain",
      },
    ],
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme:
          "com.googleusercontent.apps.37343657987-sfm8lmtea9a2f5rqjuecdp5s69d5b3e1",
      },
    ],
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
        },
        android: {
          extraProguardRules:
            "-keep class com.google.android.gms.internal.consent_sdk.** { *; }",
        },
      },
    ],
    [
      "react-native-google-mobile-ads",
      {
        androidAppId: "ca-app-pub-1967837539947027~5511847988",
        iosAppId: "ca-app-pub-1967837539947027~8876377921",
        userTrackingUsageDescription:
          "Allow this app to collect app-related data that can be used for tracking you or your device.",
        delayAppMeasurementInit: true,
        skAdNetworkItems: [
          "cstr6suwn9.skadnetwork",
          "4fzdc2evr5.skadnetwork",
          "2fnua5tdw4.skadnetwork",
          "ydx93a7ass.skadnetwork",
          "p78axxw29g.skadnetwork",
          "v72qych5uu.skadnetwork",
          "ludvb6z3bs.skadnetwork",
          "cp8zw746q7.skadnetwork",
          "3sh42y64q3.skadnetwork",
          "c6k4g5qg8m.skadnetwork",
          "s39g8k73mm.skadnetwork",
          "3qy4746246.skadnetwork",
          "hs6bdukanm.skadnetwork",
          "mlmmfzh3r3.skadnetwork",
          "v4nxqhlyqp.skadnetwork",
          "wzmmz9fp6w.skadnetwork",
          "su67r6k2v3.skadnetwork",
          "yclnxrl5pm.skadnetwork",
          "7ug5zh24hu.skadnetwork",
          "gta9lk7p23.skadnetwork",
          "vutu7akeur.skadnetwork",
          "y5ghdn5j9k.skadnetwork",
          "v9wttpbfk9.skadnetwork",
          "n38lu8286q.skadnetwork",
          "47vhws6wlr.skadnetwork",
          "kbd757ywx3.skadnetwork",
          "9t245vhmpl.skadnetwork",
          "a2p9lx4jpn.skadnetwork",
          "22mmun2rn5.skadnetwork",
          "4468km3ulz.skadnetwork",
          "2u9pt9hc89.skadnetwork",
          "8s468mfl3y.skadnetwork",
          "ppxm28t8ap.skadnetwork",
          "uw77j35x4d.skadnetwork",
          "pwa73g5rt2.skadnetwork",
          "578prtvx9j.skadnetwork",
          "4dzt52r2t5.skadnetwork",
          "tl55sbb4fm.skadnetwork",
          "e5fvkxwrpn.skadnetwork",
          "8c4e2ghe7u.skadnetwork",
          "3rd42ekr43.skadnetwork",
          "3qcr597p9d.skadnetwork",
        ],
      },
    ],
    "expo-font",
    "expo-tracking-transparency",
    "expo-sqlite",
    "expo-apple-authentication",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: "2c946f2e-0cec-4c9b-8999-cf6754225145",
    },
  },
  updates: {
    url: "https://u.expo.dev/2c946f2e-0cec-4c9b-8999-cf6754225145",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
};

export default config;
