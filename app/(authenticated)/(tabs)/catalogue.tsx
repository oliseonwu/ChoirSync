import { StyleSheet, ScrollView, Text, View } from "react-native";
import { verticalScale, moderateScale } from "@/utilities/TrueScale";
import React, { useEffect, useRef, useCallback } from "react";
import Parse from "@/services/Parse";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { useWindowDimensions } from "react-native";
import { useCurrentTrack } from "@/contexts/CurrentTrackContext";
import { useNowPlayingContext } from "@/contexts/NowPlayingContext";
import { Recording } from "@/types/music.types";
import { useRecordings } from "@/contexts/RecordingsContext";
import { FlashList } from "@shopify/flash-list";
import { SongItem } from "@/components/SongItem";
import AdComponent from "@/components/AdComponent";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "react-native-paper";

enum ItemType {
  DATE_AND_SONG = "DateAndSong",
  SONG = "Song",
}

export default function CatalogueScreen() {
  const rehearsalRecordCount = useRef(1);
  const { width } = useWindowDimensions();
  const { changeCurrentTrack, currentSongDetailsSV } = useCurrentTrack();
  const { recordings, isLoading, fetchRecordings, noMoreRecordings } =
    useRecordings();
  const { logoutIfNotFullyAuthenticated } = useAuth();
  useEffect(() => {
    if (recordings.length === 0) {
      logoutIfNotFullyAuthenticated().then(() => {
        fetchRecordings();
      });
    }
  }, []);

  const renderItem = useCallback(({ item }: { item: Recording }) => {
    if (item.isFirstRehearsalRecording) {
      rehearsalRecordCount.current = 1;
      return (
        <View>
          <Text style={[styles.title, styles.title1]}>
            {getHeaderText(item.rehearsalDate, rehearsalRecordCount.current)}
          </Text>

          <SongItem
            index={1}
            recording={item}
            currentSongDetailsSV={currentSongDetailsSV}
            changeCurrentTrack={changeCurrentTrack}
          />
          {ItemSeparatorComponent()}
        </View>
      );
    }

    rehearsalRecordCount.current++;

    return (
      <>
        <SongItem
          index={rehearsalRecordCount.current}
          recording={item}
          currentSongDetailsSV={currentSongDetailsSV}
          changeCurrentTrack={changeCurrentTrack}
        />
        {ItemSeparatorComponent()}
      </>
    );
  }, []);

  const ItemSeparatorComponent = useCallback(() => {
    return <View style={{ marginTop: verticalScale(44) }} />;
  }, []);

  const getItemType = useCallback((item: Recording) => {
    return item.isFirstRehearsalRecording
      ? ItemType.DATE_AND_SONG
      : ItemType.SONG;
  }, []);

  function getHeaderText(date: Date, index: number) {
    const currentDate = new Date();

    currentDate.setUTCHours(0, 0, 0, 0);
    date = new Date(date);
    date.setUTCHours(0, 0, 0, 0);
    const oneWeekAgo = new Date(currentDate);
    oneWeekAgo.setDate(currentDate.getDate() - 7);

    // Check if this is the most recent recording and within the last week
    const isFirstGroup = index === 1;
    const isWithinWeek = date >= oneWeekAgo;

    if (isFirstGroup && isWithinWeek) {
      return "This Week's Rehearsal";
    }
    return new Date(date).toLocaleDateString("en-US", {
      timeZone: "UTC",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const onEndReached = () => {
    if (!noMoreRecordings) {
      fetchRecordings();
    }
  };

  const ListFooterComponent = () => {
    if (!isLoading) {
      return null;
    }
    return (
      <View>
        <Button disabled loading>
          Fetching more...
        </Button>
      </View>
    );
  };

  if (isLoading && recordings.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <SkeletonLoader width={width} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AdComponent />
      <FlashList
        contentContainerStyle={styles.flashListContent}
        data={recordings}
        estimatedItemSize={moderateScale(63)}
        renderItem={renderItem}
        getItemType={getItemType}
        onEndReached={onEndReached}
        ListFooterComponent={ListFooterComponent}
        showsVerticalScrollIndicator={true}
        onEndReachedThreshold={0.7} // Trigger onEndReached when user is 70% away from the bottom of the list
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flashListContent: {
    paddingBottom: verticalScale(100),
  },
  title: {
    fontSize: moderateScale(20),
    fontFamily: "Inter-Medium",
    color: "#3E3C48",
    marginBottom: verticalScale(26),
    paddingHorizontal: moderateScale(16),
  },
  title1: {
    marginTop: verticalScale(32),
  },

  loadingContainer: {
    flex: 1,
    paddingHorizontal: moderateScale(16),
    backgroundColor: "#fff",
  },
});
