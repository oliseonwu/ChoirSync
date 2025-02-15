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
import { useCurrentTrack } from "@/contexts/CurrentTrackContext";
import { useNowPlayingContext } from "@/contexts/NowPlayingContext";
import { useEffect, useRef } from "react";

export default function RecordingsScreen() {
  const { recordings, isLoading, fetchRecordings } = useRecordings();
  const rehearsalRecordCount = useRef(0);
  const { width } = useWindowDimensions();

  const { changeCurrentTrack, currentSongDetailsSV } = useCurrentTrack();
  const { openPlayer } = useNowPlayingContext();

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  useEffect(() => {
    if (recordings.length === 0) {
      fetchRecordings();
    }
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
      <StatusBar style="dark" />
      <Text style={styles.title}>Recordings</Text>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {recordings.map((recording, index) => {
          const isWithinWeek = new Date(recording.rehearsalDate) >= oneWeekAgo;

          if (!isWithinWeek) {
            return null;
          }

          const showHeader =
            index === 0 ||
            recordings[index - 1].rehearsalDate.toDateString() !==
              recording.rehearsalDate.toDateString();

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
  title: {
    fontSize: moderateScale(20),
    fontFamily: "Inter-Medium",
    color: "#3E3C48",
    marginTop: verticalScale(20),
    marginHorizontal: horizontalScale(16),
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContent: {
    padding: horizontalScale(16),
  },
});
