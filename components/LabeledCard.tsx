import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { moderateScale, verticalScale } from "@/utilities/TrueScale";

type LabeledCardProps = {
  imgUrl: string; // image url for the car
  label: string; // text underneath the card
  onPress: () => void; // callback function when card is pressed
};

// FC is just type function component. React components
// are made with functional components
const LabeledCard: React.FC<LabeledCardProps> = (props) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.card}></View>
      <Text style={styles.label}>{props.label}</Text>
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
  label: {
    paddingTop: verticalScale(12),
  },
});
