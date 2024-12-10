import { createContext, useState } from "react";

type CurrentTrackDetailsType = {
  songId: string;
  songName: string;
  artistName: string;
  songUrl: string;
};

type CurrentTrackContextType = {
  currentTrackDetails: CurrentTrackDetailsType;
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

  return (
    <CurrentTrackContext.Provider value={{ currentTrackDetails }}>
      {children}
    </CurrentTrackContext.Provider>
  );
};
