import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import HomeIcon from "@/assets/images/SVG/house-chimney.svg";
import CatalogIcon from "@/assets/images/SVG/folder-music.svg";
import { moderateScale, verticalScale } from "@/utilities/TrueScale";
import MiniMusicPlayer from "./miniplayerComponents/MiniMusicPlayer";
import { useMiniPlayer } from "@/contexts/MiniPlayerContext";
const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const activeColor = "#8F8F8F";
  const inactiveColor = "#C2C2C2";
  const { buildHref } = useLinkBuilder();
  const { isVisibleSV } = useMiniPlayer();

  const getIcon = (route: string, isFocused: boolean) => {
    switch (route) {
      case "index":
        return (
          <HomeIcon
            width={verticalScale(24)}
            height={verticalScale(24)}
            fill={isFocused ? activeColor : inactiveColor}
          />
        );
      case "catalogue":
        return (
          <CatalogIcon
            width={verticalScale(24)}
            height={verticalScale(24)}
            fill={isFocused ? activeColor : inactiveColor}
          />
        );
    }
  };

  return (
    <>
      <MiniMusicPlayer bottomOffset={0} />
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <PlatformPressable
              key={index}
              href={buildHref(route.name, route.params)}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
              android_ripple={{ color: "transparent" }} // Disables the ripple effect for Android
            >
              {getIcon(route.name, isFocused)}
              <Text
                style={[
                  styles.tabText,
                  { color: isFocused ? activeColor : inactiveColor },
                ]}
              >
                {typeof label === "string"
                  ? label
                  : typeof label === "function"
                    ? label({
                        focused: isFocused,
                        color: activeColor,
                        position: "below-icon", // or whatever position you need
                        children: route.name,
                      })
                    : null}
              </Text>
            </PlatformPressable>
          );
        })}
      </View>
    </>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: verticalScale(10),
    zIndex: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontFamily: "Inter-Medium",
    fontSize: moderateScale(11),
    marginTop: verticalScale(3),
  },
});
