import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from "expo-image";
import LandingPageImage from "../assets/images/landing-Page.png";
import { useNavigation, router } from 'expo-router';
import { horizontalScale, moderateScale, verticalScale } from '@/utilities/TrueScale';
import { StatusBar } from 'expo-status-bar';
import BackButton from "@/assets/images/SVG/back-Button.svg"

export default function LandingPage() {
  const navigation = useNavigation()

  return (
    <View style={styles.MainContainer}>
      <StatusBar style="light" />

      <View style={styles.TopContainer}>
        <Image style={styles.LandingPageImage} source={LandingPageImage} 
        contentFit="cover"
        cachePolicy={"memory"}
        ></Image>

      </View>

      <View style={styles.BottomContainer}>
        <Text style={styles.Heading1}>{"Organise and share\nchoir recording."}</Text>
        <Text style={styles.Heading2}>{"This app is designed for choir groups, providing easy"+ 
        " access to rehearsal recordings for their choir members."}</Text>

        <View style={styles.BtnRowContainer}>
          <TouchableOpacity style={[ styles.Btn,styles.btnHollow]} onPress={()=>router.navigate("/loginOptions")}>
            <Text style={[styles.btnText, {color: "#313234"}]}>Login</Text>
          </TouchableOpacity>

          <View style={styles.HorizontalSpaceView}></View>

          <TouchableOpacity style={[styles.Btn,styles.BtnBlack]} onPress={()=>router.navigate("/signUpOptions")}>
            <Text style={[styles.btnText, {color: "#ffff"}]}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    MainContainer:{
      backgroundColor: "#F9F7F7",

        flex: 1,
    },
    TopContainer:{
        flex: 7,
    },
    
    LandingPageImage:{
      width: "100%",
      height: "100%",
    },
    BottomContainer:{
        flex: 5,
        justifyContent: "center",
        marginHorizontal: horizontalScale(21),
    }, 
    Heading1:{
      fontFamily: "Inter-Medium",
      fontSize: moderateScale(32),
      color: "#313234",
      marginBottom: "5%",
    },
    Heading2:{
      fontFamily: "Inter-Regular",
      fontSize: moderateScale(16),
      color: "#525355"
    },
    BtnRowContainer:{
      flexDirection: "row",
      alignItems: "flex-start",
      marginTop: "10%",
    },
    Btn: {
      flex: 1,
      padding: moderateScale(20),
      // padding: 20,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: moderateScale(10),
    },
    BtnBlack:{
      backgroundColor: "#313234",

    },
    HorizontalSpaceView:{
      width: horizontalScale(15.26)
    },

    btnHollow: {
      borderColor:"#313234",
      borderWidth: 1,
    },
    btnText: {
      color: "#ffff",
      fontFamily: "Inter-SemiBold",
      fontSize: moderateScale(16),
    },
})