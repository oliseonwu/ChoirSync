import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  Linking,
} from "react-native";
import {
  moderateScale,
  horizontalScale,
  verticalScale,
  getWindowSize,
  isSmallHeightDevice,
} from "@/utilities/TrueScale";
import { Image } from "expo-image";
import ThisWeekCard from "@/components/ThisWeekCard";
import MiniMusicPlayer from "@/components/miniplayerComponents/MiniMusicPlayer";
import { useMiniPlayer } from "@/contexts/MiniPlayerContext";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useEffect, useMemo } from "react";
import { router, SplashScreen } from "expo-router";
import Constants from "expo-constants";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { StatusBar } from "expo-status-bar";
import AdComponent from "@/components/AdComponent";
import { globalStyles } from "@/shared/css/GlobalCss";
import { useRecordings } from "@/contexts/RecordingsContext";
import { useNewSongs } from "@/contexts/newSongsContext";
import { NewSongsType } from "../newSongs";
import AsyncStorageService, {
  AsyncStorageKeys,
} from "@/services/AsyncStorageService";
export default function HomeScreen() {
  const { isVisibleSV, showPlayer } = useMiniPlayer();
  const tabBarHeight = useBottomTabBarHeight();
  // We must call this to setup the push notifications on the device
  const {
    notification,
    registerForPushNotifications,
    setupListeners,
    removeListeners,
  } = usePushNotifications();
  const { fetchRecordings, recordings } = useRecordings();
  const { fetchNewSongs, focusedSongs, unFocusedSongs, thisWeekSongDetected } =
    useNewSongs();

  useEffect(() => {
    initialPageSetup();

    return () => {
      console.log("unmounting");
      removeListeners();
    };
  }, []);

  const initialPageSetup = async () => {
    showPlayer();
    setupListeners();
    await registerForPushNotifications();

    if (recordings.length === 0) {
      await fetchRecordings();
    }

    if (focusedSongs.length === 0 && unFocusedSongs.length === 0) {
      await fetchNewSongs();
    }

    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);

    AsyncStorageService.getItem(AsyncStorageKeys.PUSH_TOKEN).then(
      (pushToken) => {
        console.log("pushToken", pushToken);
      }
    );
  };

  const hasThisWeekRecordings = useMemo(() => {
    return recordings.some((recording) => {
      const rehearsalDate = new Date(recording.rehearsalDate);
      rehearsalDate.setUTCHours(0, 0, 0, 0);
      const oneWeekAgo = new Date(new Date().setDate(new Date().getDate() - 7));
      oneWeekAgo.setUTCHours(0, 0, 0, 0);
      return rehearsalDate >= oneWeekAgo;
    });
  }, [recordings]);

  const hompageBanner = useMemo(() => {
    return (
      <>
        <Text style={globalStyles.heading1}>Members Picks</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          // disabled={true}
          style={styles.BannerContainer}
          onPress={() => {
            router.push({
              pathname: "/newSongs",
              params: {
                pageTitle: "Members Picks",
                newSongsType: NewSongsType.ALL,
              },
            });
          }}
        >
          <Image
            source={require("@/assets/images/color-card-1.png")}
            style={styles.BannerImage}
            contentFit="cover"
          />
          <View style={styles.BannerContent}>
            <Text style={styles.BannerTitle}>HandPicked Songs</Text>
            <Text style={styles.BannerSubtitle}>
              Listen to Songs picked by your group
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  }, []);

  return (
    <View style={[styles.Container]}>
      <StatusBar style="dark" />

      <View style={styles.Section1}>
        <Text style={globalStyles.heading1}>This Week</Text>
        <View style={styles.Section1Content1}>
          <ThisWeekCard
            title="Recordings"
            icon={require("@/assets/images/mic-icon.png")}
            showDot={hasThisWeekRecordings}
            onPress={() => {
              router.push({
                pathname: "/recordings",
              });
            }}
          />
          <ThisWeekCard
            // disabled={true}
            title="New Songs"
            icon={require("@/assets/images/music-icon-2.png")}
            showDot={thisWeekSongDetected}
            onPress={() => {
              router.push({
                pathname: "/newSongs",
                params: {
                  newSongsType: NewSongsType.FOCUSED,
                },
              });
            }}
          />
        </View>
        <View style={styles.rowGap}></View>
        <ThisWeekCard
          disabled={true}
          title="Saved Songs"
          icon={require("@/assets/images/bookmark-icon.png")}
        />
      </View>

      {/* <View style={styles.spacer}></View> */}
      <View style={styles.Section2}>
        {hompageBanner}
        <View style={styles.adContainer}>
          <AdComponent
            borderRadius={moderateScale(6)}
            borderLeftWidth={moderateScale(0.5)}
            borderRightWidth={moderateScale(0.5)}
            borderTopWidth={moderateScale(0.5)}
            borderBottomWidth={moderateScale(0.5)}
            paddingVertical={verticalScale(16)}
          />
        </View>
      </View>
      <MiniMusicPlayer bottomOffset={tabBarHeight} isVisibleSV={isVisibleSV} />
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    position: "relative",
    flex: 1,
    backgroundColor: "#ffff",
    // paddingBottom: "22%",
    paddingBottom: verticalScale(100),
  },
  statusBar: {
    height: Constants.statusBarHeight,
    // backgroundColor: "red",
  },
  headerContainer: {
    width: "100%",
    // backgroundColor: "pink",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginHorizontal: horizontalScale(30),
  },

  profilePic: {
    width: moderateScale(39),
    height: moderateScale(39),
    borderRadius: moderateScale(19.5),
    marginRight: moderateScale(20),
    marginBottom: verticalScale(1),
  },
  SectionTitle: {
    fontSize: verticalScale(20),
    marginBottom: verticalScale(20),
    marginTop: verticalScale(10),
    fontFamily: "Inter-SemiBold",
    color: "#3E3C48",
  },
  Section1: {
    marginTop: "1%",
    marginHorizontal: horizontalScale(16),
    // paddingBottom: verticalScale(12),
    // marginBottom: verticalScale(10),
    // flex: 1,
    flexBasis: "39%",
    // flexGrow: 2,
    // flexGrow: 0,
    // flexShrink: 1,
    // flexGrow: 0,
    // flexShrink: 0,
  },
  Section1Content1: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: horizontalScale(18),
  },
  rowGap: {
    flex: 1,
    maxHeight: "10%",
  },
  Section2: {
    // marginTop: "16%",
    marginHorizontal: horizontalScale(16),
    flex: 4,
    marginTop: isSmallHeightDevice() ? "8%" : verticalScale(0),
  },
  BannerContainer: {
    backgroundColor: "#FAFAFA",
    borderRadius: moderateScale(6),
    padding: moderateScale(2),
    flexDirection: "row",
    borderWidth: moderateScale(0.5),
    justifyContent: "center",
    borderColor: "#E6E9E8",
    // marginBottom: "20%",
    maxHeight: verticalScale(187),
    flex: 1,
  },

  BannerImage: {
    flex: 0.83,
    borderTopLeftRadius: moderateScale(6),
    borderBottomLeftRadius: moderateScale(6),
    // backgroundColor: "blue",
  },
  BannerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "green",
  },
  BannerTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: moderateScale(14),
    color: "#3E3C48",
    // letterSpacing: moderateScale(0.01),
    marginHorizontal: "5%",
  },
  BannerSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: moderateScale(14),
    color: "#969696",
    letterSpacing: moderateScale(0.01),
    marginTop: verticalScale(6),
    marginHorizontal: "10%",
  },
  adContainer: {
    justifyContent: "flex-end",
    flex: 1,
    // backgroundColor: "red",
  },
  // spacer: {
  //   flex: 1,
  //   backgroundColor: "red",
  // },
});
