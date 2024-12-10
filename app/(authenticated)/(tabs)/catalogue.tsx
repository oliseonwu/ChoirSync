import { StyleSheet, ScrollView } from "react-native";
import { Text, View } from "@/components/Themed";
import SongListItem from "@/components/SongListItem";
import { verticalScale, moderateScale } from "@/utilities/TrueScale";

// Mock data for the songs
const songData = [
  {
    id: "1",
    songName: "Praise",
    artistName: "Sister Nike",
    isPlaying: false,
  },
  {
    id: "2",
    songName: "Worship",
    artistName: "Sister Nike",
    isPlaying: true,
  },
  {
    id: "3",
    songName: "Offering",
    artistName: "Sister Nike",
    isPlaying: false,
  },
];

export default function CatalogueScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, styles.title1]}>This Week's Rehearsal</Text>

        {songData.map((song, index) => (
          <SongListItem
            key={song.id}
            order={index + 1}
            imgUrl="https://picsum.photos/200/300"
            songName={song.songName}
            artistName={song.artistName}
            isPlaying={song.isPlaying}
            space={index !== 0}
          />
        ))}

        <Text style={[styles.title, styles.title2]}>07/15/24</Text>
        {songData.map((song, index) => (
          <SongListItem
            key={song.id + "_past"}
            order={index + 1}
            imgUrl="https://picsum.photos/200/300"
            songName={song.songName}
            artistName={song.artistName}
            isPlaying={song.isPlaying}
            space={index !== 0}
          />
        ))}
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
});
