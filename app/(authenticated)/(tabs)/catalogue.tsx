import { StyleSheet, ScrollView } from "react-native";
import { Text, View } from "@/components/Themed";
import SongListItem from "@/components/SongListItem";
import { verticalScale, moderateScale } from "@/utilities/TrueScale";
import { useState, useEffect, useRef } from "react";
import Parse from "@/services/Parse";
import { authService } from "@/services/AuthService";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { useWindowDimensions } from "react-native";
import { useCurrentTrack } from "@/contexts/CurrentTrackContext";
import { useNowPlayingContext } from "@/contexts/NowPlayingContext";
import { Recording } from "@/types/music.types";
import { router } from "expo-router";
import { useRecordings } from "@/contexts/RecordingsContext";

export default function CatalogueScreen() {
  const rehearsalRecordCount = useRef(0);
  const { width } = useWindowDimensions();
  const { changeCurrentTrack, currentSongDetailsSV } = useCurrentTrack();
  const { openPlayer } = useNowPlayingContext();
  const { recordings, isLoading, fetchRecordings } = useRecordings();

  useEffect(() => {
    fetchRecordings();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <SkeletonLoader width={width} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {recordings.map((recording, index) => {
          const showHeader =
            index === 0 || // Always show header for first recording
            recordings[index - 1].rehearsalDate.toDateString() !==
              recording.rehearsalDate.toDateString(); // Show header when date changes

          if (showHeader) {
            rehearsalRecordCount.current = 1;
          } else {
            rehearsalRecordCount.current++;
          }

          return (
            <SongListItem
              key={recording.id}
              recording={recording}
              index={rehearsalRecordCount.current}
              space={!showHeader && index !== 0}
              showHeader={showHeader}
              onPress={() => {
                changeCurrentTrack(
                  recording.id,
                  recording.name,
                  recording.singerName,
                  recording.link ?? ""
                );
                openPlayer();
              }}
              isFirst={index === 0}
              currentSongDetailsSV={currentSongDetailsSV}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    paddingBottom: verticalScale(100),
  },

  loadingContainer: {
    flex: 1,
    paddingHorizontal: moderateScale(16),
  },
});
