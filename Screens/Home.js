import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
//import CurrentWebSocket from './Components/CurrentWebSocket'
import CurrentStatus from './Components/CurrentStatus'
export default function Home({navigation}) {
  return (
    <View>
      <CurrentStatus/>
    </View>
  )
}

const styles = StyleSheet.create({})