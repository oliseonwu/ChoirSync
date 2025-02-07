import { createContext, useContext, useState } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

type CurrentTrackDetailsType = {
  songId: string;
  songName: string;
  artistName: string;
  songUrl: string;
};

type CurrentTrackContextType = {
  currentTrackDetails: CurrentTrackDetailsType;
  currentTrackState: "playing" | "paused";
  togglePlay: () => void;
  setCurrentTrack: (
    songId: string,
    songName: string,
    artistName: string,
    songUrl: string
  ) => void;

  returnCurrentSongDetailsSV: () => SharedValue<{
    songId: string;
    state: string;
  }>;
};

const CurrentTrackContext = createContext<CurrentTrackContextType | undefined>(
  undefined
);

export const CurrentTrackProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Shared value to store the current song details and state
  // This is used to update the catalog screen when the current song changes
  // and avoid re-rendering the catalog screen when the current song changes
  const currentSongDetailsSV = useSharedValue({
    songId: "",
    state: "paused",
  });

  const [currentTrackDetails, setCurrentTrackDetails] =
    useState<CurrentTrackDetailsType>({
      songId: "",
      songName: "",
      artistName: "",
      songUrl: "",
    });

  const [currentTrackState, setCurrentTrackState] = useState<
    "playing" | "paused"
  >("paused");

  const setCurrentTrack = (
    songId: string,
    songName: string,
    artistName: string,
    songUrl: string
  ) => {
    setCurrentTrackDetails({ songId, songName, artistName, songUrl });
    setCurrentTrackState("playing");
    currentSongDetailsSV.value = { songId, state: "playing" };
  };

  const togglePlay = () => {
    setCurrentTrackState((prevState) =>
      prevState === "playing" ? "paused" : "playing"
    );
  };

  const returnCurrentSongDetailsSV = () => {
    return currentSongDetailsSV;
  };

  return (
    <CurrentTrackContext.Provider
      value={{
        currentTrackDetails,
        setCurrentTrack,
        currentTrackState,
        togglePlay,
        returnCurrentSongDetailsSV,
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
