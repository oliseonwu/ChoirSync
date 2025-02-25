import { createContext, useContext, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import {
  CurrentTrackContextType,
  CurrentTrackDetailsType,
  CurrentTrackState,
} from "@/types/currentTrackContext.types";

const CurrentTrackContext = createContext<CurrentTrackContextType | undefined>(
  undefined
);

export const CurrentTrackProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Shared value to store the current song id and state
  // This is used to update the catalog screen when the current song changes
  // and avoid using the render cycle of react.
  const currentSongDetailsSV = useSharedValue({
    songId: "",
    state: "paused",
  });

  // State to store the current song details
  const [currentTrackDetails, setCurrentTrackDetails] =
    useState<CurrentTrackDetailsType>({
      songId: "",
      songName: "",
      artistName: "",
      songUrl: "",
    });

  // State to store the current song state
  const [currentTrackState, setCurrentTrackState] =
    useState<CurrentTrackState>("paused");

  // Custom Function to set the current song details and state
  const changeCurrentTrack = (
    songId: string,
    songName: string,
    artistName: string,
    songUrl: string
  ) => {
    setCurrentTrackDetails({ songId, songName, artistName, songUrl });
    setCurrentTrackState("playing");

    // set the shared value used to update the catalog screen
    currentSongDetailsSV.value = { songId, state: "playing" };
  };

  const togglePlay = () => {
    currentSongDetailsSV.value = {
      songId: currentTrackDetails.songId,
      state: currentTrackState === "playing" ? "paused" : "playing",
    };
    setCurrentTrackState((prevState) =>
      prevState === "playing" ? "paused" : "playing"
    );
  };

  const resetCurrentTrack = () => {
    setCurrentTrackDetails({
      songId: "",
      songName: "",
      artistName: "",
      songUrl: "",
    });
    setCurrentTrackState("paused");
    currentSongDetailsSV.value = { songId: "", state: "paused" };
  };

  return (
    <CurrentTrackContext.Provider
      value={{
        currentTrackDetails,
        changeCurrentTrack,
        currentTrackState,
        togglePlay,
        currentSongDetailsSV,
        resetCurrentTrack,
      }}
    >
      {children}
    </CurrentTrackContext.Provider>
  );
};

export const useCurrentTrack = () => {
  const context = useContext(CurrentTrackContext);
  if (context === undefined) {
    throw new Error(
      "useCurrentTrack must be used within a CurrentTrackProvider"
    );
  }
  return context;
};
