import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import {
  getWindowSize,
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import { globalStyles } from "@/shared/css/GlobalCss";

import MenuItemOne from "@/components/MenuItemOne";
import { router } from "expo-router";

import { useUser } from "@/contexts/UserContext";

const { height, width } = getWindowSize();
export default function Profile() {
  const { getCurrentUserData } = useUser();
  const currentUserData = getCurrentUserData();

  return (
    <View style={[globalStyles.container, { paddingTop: height * 0.05 }]}>
      <View style={styles.infoSection}>
        <MenuItemOne
          label="First Name"
          value={currentUserData?.firstName || "N/A"}
          onPress={() => {
            router.push({
              pathname: "/(authenticated)/(Settings)/editUser",
              params: {
                type: "firstName", // or "lastName"
                title: "Edit First Name",
                description: "Please enter your new first name below",
              },
            });
          }}
        />
        <MenuItemOne
          label="Last Name"
          value={currentUserData?.lastName || "N/A"}
          onPress={() => {
            router.push({
              pathname: "/(authenticated)/(Settings)/editUser",
              params: {
                type: "lastName", // or "lastName"
                title: "Edit Last Name",
                description: "Please enter your new last name below",
              },
            });
          }}
        />
        <View style={styles.separator} />
        <MenuItemOne
          label="Email"
          value={currentUserData?.email || "N/A"}
          onPress={() => {
            console.log("email pressed");
          }}
          borderBottomWidth={moderateScale(0.5)}
          disabled={true}
        />
      </View>
      <View style={{ flex: 1 }} />
      <TouchableOpacity style={[styles.logoutButton]}>
        <Text style={styles.logoutText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    flexGrow: 1.3,
    flexShrink: 1.3,
  },

  imageContainer: {
    position: "relative",
    aspectRatio: 1,
    width: horizontalScale(97),
  },
  profileBorderRadius: {
    borderRadius: moderateScale(48.5), // picture size/2
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  cameraOverlay: {
    position: "absolute",

    width: "100%",
    height: "100%",
    backgroundColor: "#7E7D7D",
    opacity: 0.6,
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  cameraLabel: {
    fontFamily: "Inter-Regular",
    fontSize: moderateScale(16),
    color: "#3E3C48",
    marginTop: verticalScale(12),
  },
  infoSection: {
    paddingHorizontal: horizontalScale(24),
  },
  infoRow: {
    flexDirection: "row",
    paddingVertical: verticalScale(16),
    alignItems: "center",
    borderWidth: moderateScale(0.5),
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: "#E6E9E8",
  },
  label: {
    flex: 1,
    fontFamily: "Inter-Medium",
    fontSize: moderateScale(16),
    color: "#3E3C48",
  },
  value: {
    fontFamily: "Inter-Medium",
    fontSize: moderateScale(16),
    color: "#A3A2A2",
    textAlign: "right",
    marginRight: horizontalScale(5),
    // backgroundColor: "red",
    width: (width * 46) / 100,
  },
  separator: {
    height: height * 0.04,
    borderTopWidth: verticalScale(0.5),
    borderColor: "#F7F7F7",
    // backgroundColor: "#E5E5E5",
  },
  logoutButton: {
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    justifyContent: "flex-end",
    marginBottom: (height * 6.4) / 100,
    alignItems: "center",
    borderWidth: verticalScale(1.0),
    borderColor: "#EBEBEB",
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  logoutText: {
    fontSize: moderateScale(16),
    fontFamily: "Inter-Medium",
    color: "#C15141",
  },
});
