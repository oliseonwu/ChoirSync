import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  moderateScale,
  verticalScale,
  horizontalScale,
} from "@/utilities/TrueScale";
import { useRecordings } from "@/contexts/RecordingsContext";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import SongListItem from "@/components/SongListItem";
import { useNowPlayingContext } from "@/contexts/NowPlayingContext";
import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { FlashList } from "@shopify/flash-list";
import SongListItemDetails from "@/components/SongListItemDetails";
import { Recording } from "@/types/music.types";
import SongItem from "@/components/SongItem";
import { useCurrentTrack } from "@/contexts/CurrentTrackContext";

export default function RecordingsScreen() {
  const { recordings, isLoading, fetchRecordings } = useRecordings();
  const { width } = useWindowDimensions();

  const { openPlayer } = useNowPlayingContext();
  const { currentSongDetailsSV, changeCurrentTrack } = useCurrentTrack();

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  useEffect(() => {
    if (recordings.length === 0) {
      fetchRecordings();
    }
  }, []);

  const showSkeleton = useCallback(() => {
    return (
      <View style={styles.loadingContainer}>
        <SkeletonLoader width={width} />
      </View>
    );
  }, []);

  const ItemSeparatorComponent = useCallback(() => {
    return <View style={{ height: verticalScale(44) }} />;
  }, []);

  // we used useCallback to prevent the renderItem from being
  // recreated on every render. If we didn't do this, the
  // flashlist would re-render the entire list on every render,
  // which would be a performance nightmare.
  const renderItem = useCallback(
    ({ item, index }: { item: Recording; index: number }) => (
      <SongItem
        index={index}
        recording={item}
        currentSongDetailsSV={currentSongDetailsSV}
        changeCurrentTrack={changeCurrentTrack}
      />
    ),
    []
  );
  const listEmptyComponent = useCallback(() => {
    return (
      <View style={styles.noRecordingsContainer}>
        <Text style={styles.noRecordingsText}>No recordings found</Text>
      </View>
    );
  }, []);

  if (isLoading) {
    return showSkeleton();
  }

  return (
    <View style={styles.container}>
      <FlashList
        contentContainerStyle={styles.flashListContent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        data={recordings}
        renderItem={renderItem}
        estimatedItemSize={100}
        ListEmptyComponent={listEmptyComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopWidth: moderateScale(0.7),
    borderColor: "#E8E8E8",
  },
  title: {
    fontSize: moderateScale(20),
    fontFamily: "Inter-Medium",
    color: "#3E3C48",
    marginTop: verticalScale(20),
    marginHorizontal: horizontalScale(16),
  },
  flashListContent: {
    paddingVertical: verticalScale(16),
  },
  loadingContainer: {
    flex: 1,
    paddingHorizontal: moderateScale(16),
    borderBottomWidth: moderateScale(2),
    borderTopWidth: moderateScale(0.7),
    borderColor: "#E8E8E8",
  },
  noRecordingsContainer: {
    flex: 1,
    alignItems: "center",
  },
  noRecordingsText: {
    fontSize: moderateScale(15),
    fontFamily: "Inter-Medium",
    color: "#868686",
  },
});
