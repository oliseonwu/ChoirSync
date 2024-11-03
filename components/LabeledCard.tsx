import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { moderateScale, verticalScale } from "@/utilities/TrueScale";

type LabeledCardProps = {
  imgUrl: string; // image url for the car
  label: string; // text underneath the card
  selected: boolean;
  disabled?: boolean;
  onPress: () => void; // callback function when card is pressed
};

// FC is just type function component. React components
// are made with functional components
const LabeledCard: React.FC<LabeledCardProps> = ({
  disabled = false,
  ...props
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.container, !props.selected && { opacity: 0.7 }]}
      activeOpacity={1}
      onPress={props.onPress}
    >
      <View style={[styles.card, props.selected && styles.selected]}></View>
      <Text
        style={[styles.label, props.selected && { fontFamily: "Inter-Bold" }]}
      >
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};

export default LabeledCard;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "flex-start",
  },
  card: {
    width: moderateScale(130),
    height: moderateScale(130),
    backgroundColor: "#D9D9D9",

    borderRadius: 10,
  },

  selected: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#313234",
  },
  label: {
    paddingTop: verticalScale(12),
    fontSize: moderateScale(14),
    fontFamily: "Inter-Light",
  },
});
