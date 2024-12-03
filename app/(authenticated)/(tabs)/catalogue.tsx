import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import SongListItem from "@/components/SongListItem";

export default function CatalogueScreen() {
  return (
    <View style={styles.container}>
      <SongListItem
        order={1}
        imgUrl="https://picsum.photos/200/300"
        songName="Song Name"
        artistName="Artist Name"
        isPlaying={false}
        space={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
