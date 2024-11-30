import React, { createContext, useContext, useState } from "react";

type MusicPlayerContextType = {
  isPlaying: boolean;
  togglePlay: () => void;
  isPlayerVisible: boolean;
  setIsPlayerVisible: (visible: boolean) => void;
  hidePlayer: () => void;
  showPlayer: () => void;
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
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const hidePlayer = () => {
    setIsPlayerVisible(false);
  };

  const showPlayer = () => {
    setIsPlayerVisible(true);
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        isPlaying,
        togglePlay,
        isPlayerVisible,
        setIsPlayerVisible,
        hidePlayer,
        showPlayer,
      }}
    >
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
