import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  moderateScale,
  horizontalScale,
  verticalScale,
  getWindowSize,
} from "@/utilities/TrueScale";
import { Image } from "expo-image";
import ThisWeekCard from "@/components/ThisWeekCard";
import MiniMusicPlayer from "@/components/miniplayerComponents/MiniMusicPlayer";
import { useMiniPlayer } from "@/contexts/MiniPlayerContext";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useEffect, useLayoutEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Animated from "react-native-reanimated";
import { useHeaderHeight } from "@react-navigation/elements";
import { router } from "expo-router";
import Constants from "expo-constants";
import CustomHeaderComponent from "@/components/CustomHeaderComponent";

export default function HomeScreen() {
  const { isVisibleSV, showPlayer } = useMiniPlayer();
  const tabBarHeight = useBottomTabBarHeight();
  const headerAndStatusBarHeight = useHeaderHeight();
  const headingContainerHeight =
    headerAndStatusBarHeight - Constants.statusBarHeight;
  const bottomOffset = tabBarHeight + getWindowSize().height * 0.075;

  useEffect(() => {
    showPlayer();
  }, []);
  return (
    <View style={[styles.Container]}>
      <StatusBar style="dark" />
      {/* <CustomHeaderComponent>
        <View style={styles.headerContainer}>
          <View style={styles.invisibleBox}></View>

          <Text style={styles.headerTitle}>Home</Text>
          <Image
            source={require("@/assets/images/profile-placeholder.png")}
            style={styles.profilePic}
          />
        </View>
      </CustomHeaderComponent> */}

      <View style={styles.Section1}>
        <Text
          style={[styles.SectionTitle, { marginBottom: verticalScale(26) }]}
        >
          This Week
        </Text>
        <View style={styles.Section1Content}>
          <ThisWeekCard
            title="Recordings"
            icon={require("@/assets/images/mic-icon.png")}
            showDot={true}
            onPress={() => {
              router.push({
                pathname: "/recordings",
              });
            }}
          />
          <ThisWeekCard
            disabled={true}
            title="New Songs"
            icon={require("@/assets/images/music-icon-2.png")}
          />

          <ThisWeekCard
            disabled={true}
            title="Saved Recordings"
            icon={require("@/assets/images/bookmark-icon.png")}
          />
        </View>
      </View>

      <View style={styles.Section2}>
        <Text style={styles.SectionTitle}>Trending</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.ScrollViewContentContainer}
        >
          <TouchableOpacity
            style={styles.ScrollViewContent}
            activeOpacity={0.8}
            disabled={true}
          >
            <Image
              source={require("@/assets/images/Praise card.png")}
              style={{ flex: 1, aspectRatio: 1 }}
              contentFit="cover"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ScrollViewContent}
            activeOpacity={0.8}
            disabled={true}
          >
            <Image
              style={{ flex: 1, aspectRatio: 1 }}
              source={require("@/assets/images/Worship card.png")}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
      <MiniMusicPlayer bottomOffset={tabBarHeight} isVisibleSV={isVisibleSV} />
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    position: "relative",
    flex: 1,
    backgroundColor: "#fff",
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
  invisibleBox: {
    width: moderateScale(39),
    height: moderateScale(39),
    marginLeft: moderateScale(20),
  },
  headerTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: moderateScale(16.4),
    color: "#3E3C48",
  },
  profilePic: {
    width: moderateScale(39),
    height: moderateScale(39),
    borderRadius: moderateScale(19.5),
    marginRight: moderateScale(20),
    marginBottom: verticalScale(1),
  },
  SectionTitle: {
    fontSize: moderateScale(20),
    fontFamily: "Inter-Medium",
    color: "#3E3C48",
  },
  Section1: {
    marginTop: verticalScale(20),
    marginHorizontal: horizontalScale(16),
  },
  Section1Content: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: horizontalScale(18),
    rowGap: verticalScale(30),
  },
  Section2: {
    marginTop: "12%",
    marginLeft: horizontalScale(16),
    flex: 1,
  },
  ScrollViewContentContainer: {
    gap: horizontalScale(22),
    marginTop: verticalScale(24),
    // backgroundColor: "red",
    // flex: 1,
  },
  ScrollViewContent: {
    width: "auto",
    backgroundColor: "#F0F0F0",
    borderRadius: moderateScale(10),

    overflow: "hidden",
  },
});
