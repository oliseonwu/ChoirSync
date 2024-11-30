// hooks/useMusicPlayerVisibility.ts
import { useEffect } from "react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

export const useMusicPlayerVisibility = () => {
  const { hidePlayer, showPlayer } = useMusicPlayer();

  useEffect(() => {
    hidePlayer();
    return () => {
      showPlayer();
    };
  }, []);
};
