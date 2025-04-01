import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import StandardSongListComponent, {
  LoadingState,
} from "@/components/StandardSongListComponent";
import { SavedSong } from "@/types/music.types";
import songService from "@/services/sqlite/songService";
import { useSQLiteContext } from "expo-sqlite";
import { globalStyles } from "@/shared/css/GlobalCss";
import AdComponent from "@/components/AdComponent";
import { EventRegister } from "react-native-event-listeners";
export default function SavedSongs() {
  const LIMIT = 10;
  const pageRef = useRef(1);
  const localDb = useSQLiteContext();
  const [savedSongs, setSavedSongs] = useState<SavedSong[]>([]);
  const recentlyDeletedSongRef = useRef<SavedSong | null>(null);

  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.IDLE
  );

  useEffect(() => {
    const listener = EventRegister.addEventListener("saveSong", (data) => {
      if (!data.isSaved) {
        setSavedSongs((savedSongs) =>
          savedSongs.filter((song) => {
            if (song.link !== data.link) {
              return true;
            }

            recentlyDeletedSongRef.current = song;
            return false;
          })
        );
      } else {
        setSavedSongs((savedSongs) => [
          ...savedSongs,
          recentlyDeletedSongRef.current!,
        ]);
      }
    });

    fetch();

    return () => {
      if (typeof listener === "string") {
        EventRegister.removeEventListener(listener);
      }
    };
  }, []);

  async function fetch() {
    if (loadingState !== LoadingState.IDLE) {
      return;
    }

    console.log("fetching songs");

    setLoadingState(LoadingState.LOADING);
    try {
      const songs = await songService.fetchSongs(
        localDb,
        pageRef.current,
        LIMIT
      );

      if (!songs || songs.length === 0) {
        console.log("no more songs");
        setLoadingState(LoadingState.NO_MORE_SONGS);
        return;
      }
      pageRef.current++;

      setSavedSongs([...savedSongs, ...songs]);
    } catch (error) {
      console.error(error);
    } finally {
      if (loadingState.toString() !== LoadingState.NO_MORE_SONGS) {
        setLoadingState(LoadingState.IDLE);
      }
    }
  }

  return (
    <View style={globalStyles.container}>
      <AdComponent />
      <StandardSongListComponent
        songs={savedSongs}
        loadingState={loadingState}
        onEndReached={fetch}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
