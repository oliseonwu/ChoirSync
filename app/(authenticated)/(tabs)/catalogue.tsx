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

export default function CatalogueScreen() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const rehearsalRecordCount = useRef(0);
  const { width } = useWindowDimensions();
  const { changeCurrentTrack, currentSongDetailsSV } = useCurrentTrack();
  const { openPlayer } = useNowPlayingContext();
  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    try {
      const currentUser = await authService.getCurrentUser();

      if (!currentUser) return;

      const membershipResult = await authService.checkChoirMembership(
        currentUser.id
      );
      if (!membershipResult.success || !membershipResult.isMember) return;

      const choirGroupId =
        membershipResult.choirMember?.get("choir_groups_id").id;

      const Recordings = Parse.Object.extend("Recordings");
      const query = new Parse.Query(Recordings);

      query.equalTo("choir_group_id", {
        __type: "Pointer",
        className: "ChoirGroups",
        objectId: choirGroupId,
      });

      query.include("category_id");
      query.descending("rehearsal_date");

      const results = await query.find();

      const processedRecordings = results.map((recording) => ({
        id: recording.id,
        name: recording.get("name"),
        singerName: recording.get("singer_name"),
        channel: recording.get("channel"),
        link: recording.get("link"),
        file: recording.get("File"),
        isMultiTracked: recording.get("is_multi_tracked"),
        rehearsalDate: recording.get("rehearsal_date"),
        categoryId: recording.get("category_id")?.id,
        choirGroupId: recording.get("choir_group_id").id,
      }));

      setRecordings(processedRecordings);
    } catch (error) {
      console.error("Error fetching recordings:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
