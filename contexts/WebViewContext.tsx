import { createContext, useContext, useCallback } from "react";
import {
  SharedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type WebViewContextType = {
  yOffsetSV: SharedValue<number>;
  showWebView: () => void;
  closeWebView: () => void;
};

const WebViewContext = createContext<WebViewContextType | null>(null);

export function WebViewProvider({ children }: { children: React.ReactNode }) {
  const yOffsetSV = useSharedValue(2000);

  const showWebView = useCallback(() => {
    yOffsetSV.value = withTiming(0, { duration: 300 });
  }, []);

  const closeWebView = useCallback(() => {
    yOffsetSV.value = withTiming(2000, { duration: 300 });
  }, []);

  return (
    <WebViewContext.Provider value={{ yOffsetSV, showWebView, closeWebView }}>
      {children}
    </WebViewContext.Provider>
  );
}

export const useWebView = () => {
  const context = useContext(WebViewContext);
  if (!context) {
    throw new Error("useWebView must be used within WebViewProvider");
  }
  return context;
};
