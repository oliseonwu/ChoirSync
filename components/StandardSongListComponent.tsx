import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useMemo } from "react";
import { FlashList } from "@shopify/flash-list";
import { NewSong, Recording, SavedSong } from "@/types/music.types";
import { useCurrentTrack } from "@/contexts/CurrentTrackContext";
import { SongItem } from "./SongItem";
import ListEmptyComponent from "./ListEmptyComponent";
import { verticalScale } from "@/utilities/TrueScale";
import { globalStyles } from "@/shared/css/GlobalCss";
import ListFooterComponent from "./ListFooterComponent";

/**
 * A component that displays a list of songs.
 * @param props - The props for the component.
 * @param props.songs - The songs to display.
 * @param props.changeCurrentTrack - The function to change the current track.
 * @param props.loadingState - Loading state of the list.
 * @param props.onEndReached - The function to call when the end of the list is reached.
 * @returns A component that displays a list of songs.
 */

export enum LoadingState {
  IDLE = "IDLE",
  LOADING = "LOADING",
  NO_MORE_SONGS = "NO_MORE_SONGS",
}

type StandardSongListComponentProps = {
  songs: Recording[] | NewSong[] | SavedSong[];
  onEndReached: () => void;
  loadingState: LoadingState;
};

const StandardSongListComponent = (props: StandardSongListComponentProps) => {
  const { songs, onEndReached, loadingState } = props;
  const { changeCurrentTrack, currentSongDetailsSV } = useCurrentTrack();

  const renderItem = useCallback(
    ({ item, index }: { item: Recording | NewSong | any; index: number }) => {
      return (
        <>
          <SongItem
            index={index + 1}
            recording={item}
            currentSongDetailsSV={currentSongDetailsSV}
            changeCurrentTrack={changeCurrentTrack}
          />
          {ItemSeparatorComponent}
        </>
      );
    },
    []
  );

  const ItemSeparatorComponent = useMemo(() => {
    return <View style={{ marginTop: verticalScale(44) }} />;
  }, []);

  const listEmptyComponent = useMemo(() => {
    return (
      <ListEmptyComponent
        text="No recordings found"
        paddingTop={verticalScale(30)}
        visible={loadingState === LoadingState.IDLE}
      />
    );
  }, [loadingState]);

  const listFooterComponent = useMemo(() => {
    return (
      <ListFooterComponent isLoading={loadingState === LoadingState.LOADING} />
    );
  }, [loadingState]);

  return (
    <FlashList
      data={songs}
      estimatedItemSize={66}
      renderItem={renderItem}
      onEndReached={onEndReached}
      contentContainerStyle={globalStyles.flashListContent}
      ListEmptyComponent={listEmptyComponent}
      ListFooterComponent={listFooterComponent}
      showsVerticalScrollIndicator={true}
      onEndReachedThreshold={0.7} // Trigger onEndReached when user is 70% away from the bottom of the list
    />
  );
};

export default StandardSongListComponent;

const styles = StyleSheet.create({});
