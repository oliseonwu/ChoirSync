import React, { createContext, useContext, useState } from "react";

type MusicPlayerContextType = {
  isPlaying: boolean;
  togglePlay: () => void;
};

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(
  undefined
);

export const MusicPlayerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <MusicPlayerContext.Provider value={{ isPlaying, togglePlay }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
};
