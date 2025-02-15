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
import MiniMusicPlayer from "@/components/MiniMusicPlayer";
import { useMiniPlayer } from "@/contexts/MiniPlayerContext";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useEffect, useLayoutEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Animated from "react-native-reanimated";
import { useHeaderHeight } from "@react-navigation/elements";
import { router } from "expo-router";
import { NowPlayingComponent } from "@/components/NowPlayingComponent";

export default function HomeScreen() {
  const { isVisibleSV, showPlayer } = useMiniPlayer();
  const tabBarHeight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    showPlayer();
  }, []);
  return (
    <View style={styles.Container}>
      <StatusBar style="dark" />

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
            title="New Songs"
            icon={require("@/assets/images/music-icon-2.png")}
            showDot={true}
          />

          <ThisWeekCard
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
          >
            <Image
              source={require("@/assets/images/Praise card.png")}
              style={{ flex: 1 }}
              contentFit="cover"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ScrollViewContent}
            activeOpacity={0.8}
          >
            <Image
              style={{ flex: 1 }}
              source={require("@/assets/images/Worship card.png")}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
      <NowPlayingComponent />
      <MiniMusicPlayer bottomOffset={tabBarHeight} isVisibleSV={isVisibleSV} />
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    position: "relative",
    flex: 1,
    backgroundColor: "#fff",
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
  },
  ScrollViewContent: {
    width: verticalScale(342),
    height: "78%",
    backgroundColor: "#F0F0F0",
    borderRadius: moderateScale(10),

    overflow: "hidden",
  },
});
