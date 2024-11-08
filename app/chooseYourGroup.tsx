import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
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
import Parse from "@/services/Parse";

type GroupItem = {
  id: string;
  name: string;
};

const ChooseYourGroup = () => {
  const headerHeight = useHeaderHeight();
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const ChoirGroups = Parse.Object.extend("ChoirGroups");
      const query = new Parse.Query(ChoirGroups);

      const results = await query.find();

      const formattedGroups: GroupItem[] = results.map((group) => ({
        id: group.id,
        name: group.get("name"),
      }));

      setGroups(formattedGroups);
    } catch (error: any) {
      Alert.alert(
        "Error",
        "Failed to load choir groups. Please try again later."
      );
      console.error("Error fetching groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: GroupItem }) => (
    <View style={style2.listItem}>
      <Text style={style2.groupName}>{item.name}</Text>
      <TouchableOpacity
        style={style2.joinButton}
        onPress={() => {
          router.navigate({
            pathname: "/inviteCode",
            params: { groupName: item.name, groupId: item.id },
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

      {isLoading ? (
        <View style={style2.loadingContainer}>
          <ActivityIndicator size="large" color="#313234" />
        </View>
      ) : (
        <View style={styles.TopContainer}>
          <Text style={[styles.H1, { marginBottom: verticalScale(32) }]}>
            Choose your Group
          </Text>

          {groups.length === 0 ? (
            <View style={style2.emptyContainer}>
              <Text style={style2.emptyText}>No choir groups available</Text>
            </View>
          ) : (
            <FlatList
              data={groups}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={style2.listContainer}
              showsVerticalScrollIndicator={true}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default ChooseYourGroup;

const style2 = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
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
  loadingContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "Inter-Regular",
    fontSize: moderateScale(16),
    color: "#595959",
  },
});
