import { verticalScale } from "@/utilities/TrueScale";
import { createContext, useContext } from "react";
import {
  Easing,
  ReduceMotion,
  SharedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type NowPlayingContextType = {
  yOffsetSV: SharedValue<number>;
  closePlayer: () => void;
  openPlayer: () => void;
};

const NowPlayingContext = createContext<NowPlayingContextType | undefined>(
  undefined
);

export const NowPlayingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const yOffsetSV = useSharedValue(verticalScale(1000));

  const setYOffset = (endValue: number) => {
    yOffsetSV.value = withTiming(endValue, {
      duration: 440,

      easing: Easing.inOut(Easing.sin),
      reduceMotion: ReduceMotion.System,
    });
  };

  const closePlayer = () => {
    setYOffset(verticalScale(1000));
  };

  const openPlayer = () => {
    setYOffset(0);
  };
  return (
    <NowPlayingContext.Provider value={{ yOffsetSV, closePlayer, openPlayer }}>
      {children}
    </NowPlayingContext.Provider>
  );
};

export const useNowPlayingContext = () => {
  const context = useContext(NowPlayingContext);
  if (!context) {
    throw new Error(
      "useNowPlayingContext must be used within a NowPlayingProvider"
    );
  }
  return context;
};
