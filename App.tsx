import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'


import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons';



import Home from './Screens/Home'
import Settings from './Screens/Settings'
import Bill from './Screens/Bill'
import Statistics from './Screens/Statistics'





const Tab = createBottomTabNavigator()





const homeName = "Home";
const statisticsName = "Statistics";
const settingsName = "Settings";
const billName = "Bill";



import React from 'react'

 export default function App() {



  return (
    <NavigationContainer>
      <Tab.Navigator  
      initialRouteName= {homeName}

    
      screenOptions={({route}) => ({

  


        tabBarIcon : ({focused,color,size})=>{
          let iconName : any;
          let rn =route.name;

          if (rn===homeName){
             iconName = focused? 'home' :'home-outline'
          }
          else if (rn === statisticsName){
            iconName = focused? 'list' :'list-outline'
          }
          else if (rn === settingsName){
            iconName = focused? 'settings' :'settings-outline'
          }
          else if (rn === billName){
            iconName = focused? 'home' :'home-outline'
          }

          return <Ionicons name={iconName} size={size} color={color}/>

        },

        tabBarActiveTintColor : "green",
        tabBarInactiveTintColor :'grey',
        tabBarLabelStyle : {paddingBottom : 10, fontSize : 10},
        tabBarStyle:{padding:10, height : 70}
        

      })}
      
     
      
      >
   
      <Tab.Screen name = {homeName} component={Home}></Tab.Screen>
      <Tab.Screen name = {statisticsName} component={Statistics}></Tab.Screen>
      <Tab.Screen name = {billName} component={Bill}></Tab.Screen>
      <Tab.Screen name = {settingsName} component={Settings}></Tab.Screen>


      </Tab.Navigator>

    </NavigationContainer>
   
   
  )
}



