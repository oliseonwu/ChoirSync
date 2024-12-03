// hooks/useMusicPlayerVisibility.ts
import { useEffect, useLayoutEffect } from "react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

export const useMusicPlayerVisibility = () => {
  const { hidePlayer, showPlayer } = useMusicPlayer();

  useLayoutEffect(() => {
    hidePlayer();
    return () => {
      showPlayer();
    };
  }, []);
};
