import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import { Text } from "@/components/Themed";
import {
  verticalScale,
  horizontalScale,
  moderateScale,
} from "@/utilities/TrueScale";
import SmallMusicClipArt from "@/assets/images/SVG/Small music clip art.svg";
import PauseIcon from "@/assets/images/SVG/Pause.svg";
import PlayIcon from "@/assets/images/SVG/Play.svg";
type MiniMusicPlayerProps = {
  songName: string;
  artistName: string;
  isPlaying: boolean;
  bottomOffset: number;
  onTogglePlayback: () => void;
};

const MiniMusicPlayer = ({
  songName,
  artistName,
  isPlaying,
  onTogglePlayback,
  bottomOffset,
}: MiniMusicPlayerProps) => {
  console.log("marginBottom", bottomOffset);
  return (
    <View
      style={[
        styles.MiniMusicPlayer,
        {
          bottom:
            bottomOffset > 90 && Platform.OS === "android" ? 49 : bottomOffset,
        },
      ]}
    >
      <View style={styles.MiniMusicPlayerContent}>
        <SmallMusicClipArt
          width={verticalScale(52)}
          height={verticalScale(52)}
        />

        <View style={styles.MusicDetailsContainer}>
          <Text style={styles.MusicName}>{songName}</Text>
          <Text style={styles.MusicArtist}>{artistName}</Text>
        </View>

        <TouchableOpacity onPress={onTogglePlayback} activeOpacity={0.7}>
          {isPlaying ? (
            <PauseIcon width={verticalScale(30)} height={verticalScale(30)} />
          ) : (
            <PlayIcon width={verticalScale(30)} height={verticalScale(30)} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  MiniMusicPlayer: {
    backgroundColor: "#A3A2A2",
    width: "100%",
    height: "7.5%",
    position: "absolute",
    left: 0,
    // zIndex: 1000,
  },
  MiniMusicPlayerContent: {
    flex: 1,
    flexDirection: "row",
    marginLeft: horizontalScale(12),
    marginRight: horizontalScale(30),
    backgroundColor: "rgba(0, 0, 0, 0)",
    alignItems: "center",
  },
  MusicDetailsContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
    alignItems: "center",
  },
  MusicName: {
    fontSize: moderateScale(16),
    fontFamily: "Inter-Medium",
    color: "#F9F7F7",
  },
  MusicArtist: {
    fontSize: moderateScale(12),
    fontFamily: "Inter-Medium",
    color: "#F9F7F7",
    opacity: 0.5,
  },
});

export default MiniMusicPlayer;
