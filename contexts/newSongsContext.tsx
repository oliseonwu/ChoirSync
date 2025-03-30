import { NewSong } from "@/types/music.types";
import { createContext, useContext, useRef, useState } from "react";
import newSongsService from "@/services/NewSongsService";
import { useUser } from "./UserContext";
import { NewSongsResponse } from "@/services/NewSongsService";
type NewSongsContextType = {
  focusedSongs: NewSong[];
  unFocusedSongs: NewSong[];
  loadingState: LoadingState;
  fetchNewSongs: (refresh?: boolean) => Promise<void>;
  resetNewSongs: () => void;
  thisWeekSongDetected: boolean;
};

export enum LoadingState {
  IDLE = "IDLE",
  LOADING = "LOADING",
  NO_MORE_SONGS = "NO_MORE_SONGS",
}

const NewSongsContext = createContext<NewSongsContextType | undefined>(
  undefined
);

export function NewSongsProvider({ children }: { children: React.ReactNode }) {
  const [unFocusedSongs, setUnFocusedSongs] = useState<NewSong[]>([]);
  const [focusedSongs, setFocusedSongs] = useState<NewSong[]>([]);
  const { getCurrentUserData } = useUser();
  const { groupId } = getCurrentUserData();
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.IDLE
  );
  const [thisWeekSongDetected, setThisWeekSongDetected] =
    useState<boolean>(false);
  const currentPageRef = useRef(1);

  const fetchNewSongs = async () => {
    if (loadingState === LoadingState.LOADING) return;

    try {
      if (!groupId) {
        throw new Error("No group ID found");
      }

      setLoadingState(LoadingState.LOADING);

      const response: NewSongsResponse = await newSongsService.fetchNewSongs(
        groupId || "",
        currentPageRef.current
      );

      if (!response.success) {
        throw response.error;
      }

      if (response.returnedSongs?.numberOfSongs === 0) {
        setLoadingState(LoadingState.NO_MORE_SONGS);
        return;
      }

      if (response.returnedSongs?.focusedSongDetected) {
        setThisWeekSongDetected(true);
      }

      currentPageRef.current++;
      setFocusedSongs([
        ...focusedSongs,
        ...response.returnedSongs!.focusedSongs,
      ]);
      setUnFocusedSongs([
        ...unFocusedSongs,
        ...response.returnedSongs!.unFocusedSongs,
      ]);
    } catch (error) {
      console.error("Error fetching new songs:", error);
    } finally {
      setLoadingState(LoadingState.IDLE);
    }
  };

  const resetNewSongs = () => {
    setFocusedSongs([]);
    setUnFocusedSongs([]);
    currentPageRef.current = 1;
    setLoadingState(LoadingState.IDLE);
  };

  return (
    <NewSongsContext.Provider
      value={{
        focusedSongs,
        unFocusedSongs,
        loadingState,
        fetchNewSongs,
        resetNewSongs,
        thisWeekSongDetected,
      }}
    >
      {children}
    </NewSongsContext.Provider>
  );
}

export const useNewSongs = () => {
  const context = useContext(NewSongsContext);
  if (!context)
    throw new Error("useNewSongs must be used within a NewSongsProvider");
  return context;
};
