// SectionDisplay.tsx helps to display the section in a recording

import { StyleSheet, Text, View, FlatList } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { moderateScale, verticalScale } from "@/utilities/TrueScale";
import SectionItem from "./SectionItem";
import { isEnabled } from "react-native/Libraries/Performance/Systrace";
import { EventRegister } from "react-native-event-listeners";
import { FlashList } from "@shopify/flash-list";
import { useSharedValue } from "react-native-reanimated";
type SongData = {
  id: number;
  songName: string;
  artistName: string;
  timeStamp: string;
};

export default function SectionDisplay() {
  const selectedSongSV = useSharedValue<SongData | null>(null);

  const unclickSong = useRef<(() => void) | null>(null);

  useEffect(() => {
    const unclickListener: any = EventRegister.addEventListener(
      "selectedSong",
      (unClickFunc: () => void) => {
        // if the song is already selected, then unclick it
        if (unclickSong.current !== null) {
          unclickSong.current();
        }

        // set the unclick function for the new song
        unclickSong.current = unClickFunc;
      }
    );

    return () => {
      EventRegister.removeEventListener(unclickListener);
    };
  }, []);

  const getSelectedSongSV = () => {
    return selectedSongSV;
  };

  const changeSelectedSong = (song: SongData) => {
    selectedSongSV.value = song;
  };

  const songData = useMemo(
    () =>
      Array.from({ length: 200 }, (_, i) => {
        const id = i + 1;
        const minutes = Math.floor(i);
        const formattedMinutes = minutes.toString().padStart(2, "0");

        return {
          id,
          songName: `Song ${id}`,
          artistName: `Artist ${id}`,
          timeStamp: `${formattedMinutes}:00`,
        };
      }),
    []
  );

  // we use useCallback to prevent the renderItem function
  // from being recreated on every render
  const renderItem = useCallback(({ item }: { item: (typeof songData)[0] }) => {
    return (
      <SectionItem
        item={item}
        changeSelectedSong={changeSelectedSong}
        getSelectedSongSV={getSelectedSongSV}
      />
    );
  }, []);

  const renderContent = useMemo(() => {
    return songData.length > 0 ? (
      <View style={styles.sectionContent}>
        <FlashList
          data={songData}
          renderItem={renderItem}
          estimatedItemSize={verticalScale(80)}
          keyExtractor={(item: SongData) => item.id.toString()}
        />
      </View>
    ) : (
      <View style={styles.noSongWrapper}>
        <Text style={styles.noSongText}>No songs found</Text>
      </View>
    );
  }, [songData]);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeading}>
        <Text style={styles.headingText}>Song List</Text>
      </View>
      {renderContent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "red",
    // marginLeft: moderateScale(19),
  },
  sectionHeading: {
    flex: 0.12,
    // backgroundColor: "blue",
    justifyContent: "center",
    paddingLeft: moderateScale(19),
    borderBottomWidth: moderateScale(0.7),
    borderColor: "#E8E8E8",
  },
  headingText: {
    fontSize: moderateScale(21),
    fontFamily: "Inter-SemiBold",
    color: "#3E3C48",
  },
  sectionContent: {
    flex: 1,
  },
  noSongWrapper: {
    flex: 1,
    alignItems: "center",
  },
  noSongText: {
    fontSize: moderateScale(15),
    fontFamily: "Inter-Medium",
    color: "#868686",
    marginTop: "8%",
  },
});
