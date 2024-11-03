import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import {
  getWindowSize,
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import { useHeaderHeight } from "@react-navigation/elements";
import { StatusBar } from "expo-status-bar";
import { styles } from "@/shared/css/signinLoginCss";
import { router } from "expo-router";

type GroupItem = {
  id: string;
  name: string;
};

const GROUPS_DATA: GroupItem[] = [
  { id: "1", name: "EverLoved Choir" },
  { id: "2", name: "Atlantic Choir" },
  { id: "3", name: "Baptist Choir" },
  { id: "4", name: "Ancient Choir" },
];

const ChooseYourGroup = () => {
  const headerHeight = useHeaderHeight();

  const renderItem = ({ item }: { item: GroupItem }) => (
    <View style={style2.listItem}>
      <Text style={style2.groupName}>{item.name}</Text>
      <TouchableOpacity
        style={style2.joinButton}
        onPress={() => {
          router.navigate({
            pathname: "/inviteCode",
            params: { groupName: item.name },
          });
        }}
      >
        <Text style={style2.joinButtonText}>Join</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[
        styles.MainContainer,
        { paddingTop: verticalScale(headerHeight) },
      ]}
    >
      <StatusBar style="dark" />

      <View style={styles.TopContainer}>
        <Text style={[styles.H1, { marginBottom: verticalScale(32) }]}>
          Choose your Group
        </Text>

        <FlatList
          data={GROUPS_DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={style2.listContainer}
          showsVerticalScrollIndicator={true}
        />
      </View>
    </View>
  );
};

export default ChooseYourGroup;

const style2 = StyleSheet.create({
  listContainer: {
    paddingHorizontal: horizontalScale(20),
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(20),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  groupName: {
    fontFamily: "Inter-Regular",
    fontSize: moderateScale(16),
    color: "#313234",
  },
  joinButton: {
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(8),
  },
  joinButtonText: {
    color: "#2E78B7",
    fontFamily: "Inter-SemiBold",
    fontSize: moderateScale(16),
  },
});
