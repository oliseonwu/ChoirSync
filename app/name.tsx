import { Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { getWindowSize, horizontalScale, moderateScale, verticalScale } from '@/utilities/TrueScale'
import {useHeaderHeight} from "@react-navigation/elements"
import { StatusBar } from 'expo-status-bar'
import {styles} from "@/shared/css/signinLoginCss"

const NamePage = () => {
    const headerHeight = useHeaderHeight();
  return (
    
    <View style={[styles.MainContainer, 
    {paddingTop: verticalScale(headerHeight)}]}>
        <StatusBar style="dark" />  

    <View style={styles.TopContainer}>
      <Text style={[styles.H1,{marginBottom: verticalScale(32)}]}>Tell us about yourself</Text>
      <Text style={[styles.regularText, {paddingBottom: verticalScale(34)}]}>
        Please enter your legal name below</Text>
      
      <TextInput
      style={styles.Input}
        placeholder="First Name"
      />
      
      <TextInput
      style={[styles.Input, {marginTop: verticalScale(19.28)}]}
        placeholder="Last Name"
      />

    </View>

    <TouchableOpacity style={[styles.Btn,styles.BtnBlack]} >
            <Text style={[styles.btnText, {color: "#ffff"}]}>Next</Text>
          </TouchableOpacity>
    
    </View>
    
  )
}

export default NamePage
