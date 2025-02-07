// hooks/useMusicPlayerVisibility.ts
import { useEffect, useLayoutEffect } from "react";
import { useMiniPlayer } from "@/contexts/MiniPlayerContext";

export const useMusicPlayerVisibility = () => {
  const { hidePlayer, showPlayer } = useMiniPlayer();

  useLayoutEffect(() => {
    hidePlayer();
    return () => {
      showPlayer();
    };
  }, []);
};
