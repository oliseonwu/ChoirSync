import { createContext, useCallback, useContext, useRef } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
type BottomSheetContextType = {
  isVisible: React.RefObject<boolean>;
  animationProgress: SharedValue<number>;
  open: (withHaptics?: boolean) => void;
  close: (withHaptics?: boolean) => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined
);

export const BottomSheetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isVisible = useRef(false);
  const animationProgress = useSharedValue(0);

  const open = useCallback((withHaptics = true) => {
    isVisible.current = true;
    animationProgress.value = 1;
    if (withHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, []);

  const close = useCallback((withHaptics = true) => {
    isVisible.current = false;
    animationProgress.value = 0;
    if (withHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, []);

  return (
    <BottomSheetContext.Provider
      value={{ isVisible, animationProgress, open, close }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  }
  return context;
};
