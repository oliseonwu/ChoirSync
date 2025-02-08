import React, { createContext, useContext, useState } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

type MiniPlayerContextType = {
  isVisibleSV: SharedValue<boolean>;
  hidePlayer: () => void;
  showPlayer: () => void;
};

const MiniPlayerContext = createContext<MiniPlayerContextType | undefined>(
  undefined // this "undefined" value is used when a component is not
  // wrapped in a MusicPlayerProvider. Instead of Undefined we could
  // set a default value for the context.
);

// "MusicPlayerProvider" are just a regular component that takes childeren
// as props and returns a context provider wrapping the children.
export const MiniPlayerProvider = ({
  children, // we destructure children from props == props: {
}: // children: React.ReactNode; }
{
  children: React.ReactNode;
}) => {
  const isVisibleSV = useSharedValue(false);

  const hidePlayer = () => {
    setPlayerVisibility(false);
  };

  const showPlayer = () => {
    setPlayerVisibility(true);
  };

  const setPlayerVisibility = (visible: boolean) => {
    isVisibleSV.value = visible;
  };

  return (
    <MiniPlayerContext.Provider
      value={{
        isVisibleSV,
        hidePlayer,
        showPlayer,
      }}
    >
      {children}
    </MiniPlayerContext.Provider>
  );
};

export const useMiniPlayer = () => {
  const context = useContext(MiniPlayerContext);
  if (context === undefined) {
    throw new Error("useMiniPlayer must be used within a MiniPlayerProvider");
  }
  return context;
};
