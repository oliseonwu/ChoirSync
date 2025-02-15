import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { moderateScale, verticalScale } from "@/utilities/TrueScale";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type SongData = {
  id: number;
  songName: string;
  artistName: string;
  timeStamp: string;
};

type SectionItemProps = {
  item: SongData;
  changeSelectedSong: (song: SongData) => void;
  getSelectedSongSV: () => SharedValue<SongData | null>;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SectionItem({
  item,
  changeSelectedSong,
  getSelectedSongSV,
}: SectionItemProps) {
  const selectedSongSV = useRef(getSelectedSongSV());

  useEffect(() => {
    const tempSV = getSelectedSongSV();

    if (selectedSongSV.current.value?.id !== tempSV.value?.id) {
      console.log("Refreshing selectedSongSV");
      selectedSongSV.current.value = tempSV.value;
    }
  }, [item]);

  const handlePress = () => {
    changeSelectedSong(item);
  };

  // Animated styles
  const setTextStyle1 = useAnimatedStyle(() => {
    return {
      fontFamily:
        selectedSongSV.current.value?.id === item.id
          ? "Inter-Bold"
          : "Inter-Medium",
    };
  });

  const setTextStyle2 = useAnimatedStyle(() => {
    return {
      fontFamily:
        selectedSongSV.current.value?.id === item.id
          ? "Inter-Bold"
          : "Inter-Light",
    };
  });
  const setContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor:
        selectedSongSV.current.value?.id === item.id ? "#EEEDED" : "#fff",
    };
  });

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.container, setContainerStyle]}
    >
      <Animated.Text style={[styles.songIndex, setTextStyle1]}>
        {item.id}.
      </Animated.Text>
      <View style={styles.songInfoContainer}>
        <Animated.Text style={[styles.songName, setTextStyle1]}>
          {item.songName}
        </Animated.Text>
        <Animated.Text style={[styles.artistName]}>
          {item.artistName}
        </Animated.Text>
      </View>
      <Animated.Text style={[styles.timeStamp, setTextStyle2]}>
        {item.timeStamp}
      </Animated.Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: verticalScale(80),
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: moderateScale(19),
  },
  songIndex: {
    fontSize: moderateScale(16),
    color: "#3E3C48",
  },
  songInfoContainer: {
    flex: 1,
    marginLeft: moderateScale(21),
  },
  songName: {
    fontSize: moderateScale(16),
    color: "#3E3C48",
  },
  artistName: {
    fontSize: moderateScale(14),
    marginTop: verticalScale(6.2),
    color: "#3E3C48",
    fontFamily: "Inter-Light",
  },
  timeStamp: {
    fontSize: moderateScale(14),
    color: "#3E3C48",
    marginRight: moderateScale(26),
  },
});
