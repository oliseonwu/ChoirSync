import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { authService } from "@/services/AuthService";
import {
  getWindowSize,
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utilities/TrueScale";
import Camera from "@/assets/images/SVG/camera.svg";
import Parse from "@/services/Parse";
import { globalStyles } from "@/shared/css/GlobalCss";
import { Image } from "expo-image";
import RightArrow from "@/assets/images/SVG/right-arrow3.svg";
import MenuItemOne from "@/components/MenuItemOne";
import { router } from "expo-router";

const { height, width } = getWindowSize();
export default function Profile() {
  const [user, setUser] = useState<Parse.User | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    const currentUser = await authService.getCurrentUser();
    if (currentUser) {
      const userCopy = currentUser.clone();
      setUser(userCopy);
    }
  };

  return (
    <View style={[globalStyles.container]}>
      <View style={styles.flexContainer}></View>
      <View style={styles.profileSection}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.imageContainer, styles.profileBorderRadius]}
          onPress={() => {
            console.log("profile image pressed");
          }}
        >
          <Image
            source={require("@/assets/images/profile-placeholder-large.png")}
            style={[styles.profileImage, styles.profileBorderRadius]}
            contentFit="contain"
          />

          <View style={[styles.cameraOverlay, styles.profileBorderRadius]}>
            <Camera width={moderateScale(31)} height={moderateScale(31)} />
          </View>
        </TouchableOpacity>
        <Text style={styles.cameraLabel}>Change photo</Text>
      </View>

      <View style={styles.infoSection}>
        <MenuItemOne
          label="First Name"
          value={user?.get("firstName") || "N/A"}
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
          value={user?.get("lastName") || "N/A"}
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
        <MenuItemOne
          label="Email"
          value={user?.get("email") || "N/A"}
          onPress={() => {
            console.log("email pressed");
          }}
          borderBottomWidth={moderateScale(0.5)}
          disabled={true}
        />
        {/*<View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.label}>First Name</Text>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.value}>
            {user?.get("firstName") || "N/A"}
          </Text>
          <RightArrow
            fill={"#A3A2A2"}
            height={moderateScale(21)}
            width={moderateScale(21)}
          />
        </View>

        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.label}>Last Name</Text>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.value}>
            {user?.get("lastName") || "N/A"}
          </Text>
          <RightArrow
            fill={"#A3A2A2"}
            height={moderateScale(21)}
            width={moderateScale(21)}
          />
        </View>

        <View style={[styles.infoRow]}>
          <Text style={styles.label}>Email</Text>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.value}>
            {user?.get("email") || "N/A"}
          </Text>
          <RightArrow
            fill={"#A3A2A2"}
            height={moderateScale(21)}
            width={moderateScale(21)}
          />
        </View> */}
      </View>
      <TouchableOpacity style={[styles.logoutButton]}>
        <Text style={styles.logoutText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    // flex: 1,
    flexBasis: (height * 1) / 100, // 1% of height for the container before the flex is applied
    flexGrow: 0.6, // Take up 0.6 portion of any available space
    flexShrink: 0.6, // Shrink to 0.6 portion of any available space
    // backgroundColor: "red",
  },
  profileSection: {
    alignItems: "center",
    flexGrow: 1.3,
    flexShrink: 1.3,
    // flex: 0.52,
    // marginBottom: "15%",
    // marginBottom: (height * 7) / 100,
    // marginBottom: "2%",

    // marginBottom: "15%",
    // backgroundColor: "red",
    // justifyContent: "center",
  },

  imageContainer: {
    position: "relative",
    aspectRatio: 1,
    width: horizontalScale(97),
    // marginTop: "11%",
    // marginTop: (height * 5) / 100,
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
    flex: 8.1,
    // backgroundColor: "blue",
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
    // flex: 1,

    fontFamily: "Inter-Medium",
    fontSize: moderateScale(16),
    color: "#A3A2A2",
    textAlign: "right",
    marginRight: horizontalScale(5),
    // backgroundColor: "red",
    width: (width * 46) / 100,
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  logoutButton: {
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    // marginTop: "auto",
    // marginBottom: verticalScale(61),
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
