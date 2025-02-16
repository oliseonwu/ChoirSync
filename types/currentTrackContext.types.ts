import { SharedValue } from "react-native-reanimated";

export type CurrentTrackDetailsType = {
  songId: string;
  songName: string;
  artistName: string;
  songUrl: string;
};

export type CurrentSongDetailsSVType = SharedValue<{
  songId: string;
  state: string;
}>;

export type CurrentTrackState = "playing" | "paused";

export type CurrentTrackContextType = {
  currentTrackDetails: CurrentTrackDetailsType;
  currentTrackState: CurrentTrackState;
  togglePlay: () => void;
  changeCurrentTrack: (
    songId: string,
    songName: string,
    artistName: string,
    songUrl: string
  ) => void;
  currentSongDetailsSV: CurrentSongDetailsSVType;
};
