import { createContext, useContext, useState } from "react";

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
};

const CurrentTrackContext = createContext<CurrentTrackContextType | undefined>(
  undefined
);

export const CurrentTrackProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
  };

  const togglePlay = () => {
    setCurrentTrackState((prevState) =>
      prevState === "playing" ? "paused" : "playing"
    );
  };

  return (
    <CurrentTrackContext.Provider
      value={{
        currentTrackDetails,
        setCurrentTrack,
        currentTrackState,
        togglePlay,
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
