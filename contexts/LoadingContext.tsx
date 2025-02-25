import { createContext, useContext, useCallback } from "react";
import {
  Easing,
  ReduceMotion,
  SharedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type LoadingContextType = {
  opacity: SharedValue<number>;
  showLoading: () => void;
  hideLoading: () => void;
};

const LoadingContext = createContext<LoadingContextType | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const opacity = useSharedValue(0);

  const showLoading = useCallback(() => {
    opacity.value = withTiming(1, {
      duration: 650,
      easing: Easing.inOut(Easing.sin),
      reduceMotion: ReduceMotion.System,
    });
  }, []);

  const hideLoading = useCallback(() => {
    opacity.value = withTiming(0, { duration: 150 });
  }, []);

  return (
    <LoadingContext.Provider value={{ opacity, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};
