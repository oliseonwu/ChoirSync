import { StyleSheet, ScrollView } from "react-native";
import { Text, View } from "@/components/Themed";
import SongListItem from "@/components/SongListItem";
import { verticalScale, moderateScale } from "@/utilities/TrueScale";
import { useState, useEffect } from "react";
import Parse from "@/services/Parse";
import { authService } from "@/services/AuthService";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { useWindowDimensions } from "react-native";

type Recording = {
  id: string;
  name: string;
  singerName: string;
  channel: "YT" | "file";
  link?: string;
  file?: string;
  isMultiTracked: boolean;
  rehearsalDate: Date;
  categoryId: string;
  choirGroupId: string;
};

export default function CatalogueScreen() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { width } = useWindowDimensions();

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
        link: recording.get("Link"),
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

  const getHeaderText = (date: Date, index: number) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const oneWeekAgo = new Date(
      currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
    );

    // Check if this is the most recent recording and within the last week
    const isFirstGroup = index === 0;
    const isWithinWeek = new Date(date) >= oneWeekAgo;

    if (isFirstGroup && isWithinWeek) {
      return "This Week's Rehearsal";
    }
    return new Date(date).toLocaleDateString("en-US", { timeZone: "UTC" });
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

          return (
            <View key={recording.id}>
              {showHeader && (
                <Text
                  style={[
                    styles.title,
                    index === 0 ? styles.title1 : styles.title2,
                  ]}
                >
                  {getHeaderText(recording.rehearsalDate, index)}
                </Text>
              )}
              <SongListItem
                order={showHeader ? 1 : index + 1}
                imgUrl="https://picsum.photos/200/300"
                songName={recording.name}
                artistName={recording.singerName}
                isPlaying={false}
                space={!showHeader && index !== 0}
              />
            </View>
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
  title2: {
    marginTop: verticalScale(97),
  },
  loadingContainer: {
    flex: 1,
    paddingHorizontal: moderateScale(16),
  },
});
