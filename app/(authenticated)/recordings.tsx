import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  Platform,
} from "react-native";
import {
  moderateScale,
  verticalScale,
  horizontalScale,
} from "@/utilities/TrueScale";
import { useRecordings } from "@/contexts/RecordingsContext";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import React, { useCallback, useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { Recording } from "@/types/music.types";
import SongItem from "@/components/SongItem";
import { useCurrentTrack } from "@/contexts/CurrentTrackContext";
import ListEmptyComponent from "@/components/ListEmptyComponent";
import AdComponent from "@/components/AdComponent";

export default function RecordingsScreen() {
  const { recordings, isLoading, fetchRecordings } = useRecordings();
  const [thisWeekRecordings, setThisWeekRecordings] = useState<Recording[]>([]);
  const { width } = useWindowDimensions();
  const { currentSongDetailsSV, changeCurrentTrack } = useCurrentTrack();

  const currentDate = new Date();
  currentDate.setUTCHours(0, 0, 0, 0);
  const oneWeekAgo = new Date(currentDate);
  oneWeekAgo.setDate(currentDate.getDate() - 7);

  useEffect(() => {
    if (recordings.length === 0) {
      fetchRecordings();
    } else {
      selectThisWeekRecordings();
    }
  }, [recordings]);

  const selectThisWeekRecordings = useCallback(async () => {
    const tempThisWeekRecordings = recordings.filter((recording) => {
      const rehearsalDate = new Date(recording.rehearsalDate);
      rehearsalDate.setUTCHours(0, 0, 0, 0);
      return rehearsalDate >= oneWeekAgo;
    });

    setThisWeekRecordings(tempThisWeekRecordings);
  }, [recordings]);

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
        index={index + 1}
        recording={item}
        currentSongDetailsSV={currentSongDetailsSV}
        changeCurrentTrack={changeCurrentTrack}
      />
    ),
    []
  );

  // This must always be the last thing to render
  if (isLoading) {
    return showSkeleton();
  }

  return (
    <View style={styles.container}>
      <AdComponent />
      <FlashList
        contentContainerStyle={styles.flashListContent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        data={thisWeekRecordings}
        renderItem={renderItem}
        estimatedItemSize={moderateScale(63)}
        ListEmptyComponent={
          <ListEmptyComponent
            text="No recordings found"
            paddingTop={verticalScale(12)}
          />
        }
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
    paddingTop: verticalScale(12),
  },
  noRecordingsText: {
    fontSize: moderateScale(15),
    fontFamily: "Inter-Medium",
    color: "#868686",
  },
});
