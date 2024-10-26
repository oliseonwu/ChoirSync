import { Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { getWindowSize, horizontalScale, moderateScale, verticalScale } from '@/utilities/TrueScale'
import {useHeaderHeight} from "@react-navigation/elements"
import { StatusBar } from 'expo-status-bar'
import {styles} from "@/shared/css/signinLoginCss"
const SignUpPage = () => {
    const headerHeight = useHeaderHeight();
  return (
    
    <View style={[styles.MainContainer, 
    {paddingTop: verticalScale(headerHeight)}]}>
        <StatusBar style="dark" />  

    <View style={styles.TopContainer}>
      <Text style={styles.H1}>SignUp</Text>
      
      <TextInput
      style={styles.Input}
        placeholder="Enter Email"
      />
      
      <TextInput
      secureTextEntry={true}
      style={[styles.Input, {marginTop: verticalScale(19.28)}]}
        placeholder="Enter Password"
      />

    </View>

    <TouchableOpacity style={[styles.Btn,styles.BtnBlack]} >
            <Text style={[styles.btnText, {color: "#ffff"}]}>Sign Up</Text>
          </TouchableOpacity>
    
    </View>
    
  )
}

export default SignUpPage
