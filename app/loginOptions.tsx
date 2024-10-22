import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { horizontalScale, moderateScale } from '@/utilities/TrueScale';
import LandingPageImage from "../assets/images/login-option-landing-image.png";
import { Image } from 'expo-image'
import { StatusBar } from 'expo-status-bar'
import BackButton from "@/assets/images/SVG/back-Button.svg"


const LoginOptions = () => {
  return (
    <View style={styles.MainContainer}>

      <View style={styles.TopContainer}>
        <Image style={styles.LandingPageImage} source={LandingPageImage} contentFit="cover"
        cachePolicy={"memory"}
        ></Image>

      </View>

      <View style={styles.BottomContainer}>
          <TouchableOpacity style={[styles.Btn,styles.BtnBlack]} >
            <Text style={[styles.btnText, {color: "#ffff"}]}>Continue with Apple</Text>
          </TouchableOpacity>
      
          <TouchableOpacity style={[styles.Btn,styles.btnHollow]} >
            <Text style={[styles.btnText, {color: "#313234"}]}>Continue with Google</Text>
          </TouchableOpacity>
      
          <TouchableOpacity style={[styles.Btn,styles.btnHollow]} >
            <Text style={[styles.btnText, {color: "#313234"}]}>Continue with Email</Text>
          </TouchableOpacity>
      </View>
    </View>
  )
}

export default LoginOptions;

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
    Btn: {
      padding: moderateScale(18),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: moderateScale(10),
      marginTop: "5%",
    },
    BtnBlack:{
      backgroundColor: "#313234",

    },
    btnHollow: {
      backgroundColor:"#F0F0F0",
    },
    btnText: {
      fontFamily: "Inter-SemiBold",
      fontSize: moderateScale(18),
    },
})