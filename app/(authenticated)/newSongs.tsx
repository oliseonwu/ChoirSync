import { StyleSheet, Text, View } from "react-native";
import { globalStyles } from "@/shared/css/GlobalCss";
import React, { useCallback } from "react";
import AdComponent from "@/components/AdComponent";
import { moderateScale, verticalScale } from "@/utilities/TrueScale";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useNewSongs } from "@/contexts/newSongsContext";
import { NewSong } from "@/types/music.types";
import { SongItem } from "@/components/SongItem";
import { useCurrentTrack } from "@/contexts/CurrentTrackContext";
import ListEmptyComponent from "@/components/ListEmptyComponent";

/**
 * Enum representing the different types of new songs to display in the New Songs screen
 * @enum {string}
 * @readonly
 * @property {string} FOCUSED - Shows only focused songs for the week
 * @property {string} ALL - Shows all songs regardless of focus status
 */
export enum NewSongsType {
  FOCUSED = "FOCUSED",
  ALL = "ALL",
}
export default function NewSongsScreen() {
  const { currentSongDetailsSV, changeCurrentTrack } = useCurrentTrack();
  const { pageTitle, newSongsType } = useLocalSearchParams();
  const { focusedSongs, unFocusedSongs } = useNewSongs();

  const renderItem = useCallback(
    ({ item, index }: { item: NewSong; index: number }) => {
      return (
        <SongItem
          index={index + 1}
          recording={item}
          currentSongDetailsSV={currentSongDetailsSV}
          changeCurrentTrack={changeCurrentTrack}
        />
      );
    },
    []
  );

  const ItemSeparatorComponent = useCallback(() => {
    return <View style={{ height: verticalScale(44) }} />;
  }, []);

  return (
    <View style={[globalStyles.container, styles.container]}>
      <Stack.Screen
        options={{
          headerTitle: (pageTitle as string) || "New Songs",
        }}
      />
      <AdComponent />

      <FlashList
        data={
          newSongsType === NewSongsType.FOCUSED ? focusedSongs : unFocusedSongs
        }
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        estimatedItemSize={66}
        contentContainerStyle={globalStyles.flashListContent}
        ListEmptyComponent={
          <ListEmptyComponent
            text="No New Songs found"
            paddingTop={verticalScale(12)}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: moderateScale(0.7),
    borderColor: "#E8E8E8",
  },
});
