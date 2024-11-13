import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
//import SplashScreen from 'react-native-splash-screen';

export default function CurrentStatus(props :any) {

    //const [data, setData] = useState([]) //Create a array of useState
    const [loading, setLoading] = useState(true) // Loading state
    const [data, setData] = useState({ lastMinuteUsage: 0, lastHourUsage: 0, lastHourPeak: 0 });

    
    useEffect(() => { 
        //url and the route
        fetch('http://192.168.56.1:5000/get_homepage_data', {
            method :'GET' //use GET method

        }) 
        .then(resp => resp.json()) //Converts response to the json
        //After response we receive actual data
        .then(jsonData => {
            setLoading(false)
            setData({
                lastMinuteUsage: jsonData.lastMinuteUsage,
                lastHourUsage: jsonData.lastHourUsage,
                lastHourPeak: jsonData.lastHourPeak,
            });
          })
          .catch(error => {
            setLoading(false)
            console.error("Error fetching data:", error);
          });

         // console.log(SplashScreen)
         // if (SplashScreen) {
         //   SplashScreen.hide(); // Hide the splash screen
          //}

      }, []);
    //use an empty array dependency at the end 

    if (loading) {
        return <Text>Loading.....</Text>
    }


   // const firstItem = data.length > 0 ? data[1]["title"] : "sa"; // If data available, set firstItem to the title of the 2nd dataset

  return (
    <View style = {styles.container}>

   
      <View style={styles.mainView}>

        <View style={styles.viewCard}>
            <Text>
                Last Minute Usage
            </Text>
            <Text>
            {data.lastMinuteUsage}
            </Text>
        </View>
        <View style={styles.viewCard}>
            <Text>
                Last Hour Usage
            </Text>
            <Text>
            {data.lastHourUsage}    
            </Text>
        </View>
        <View style={styles.viewCard}>
            <Text>
                Last Hour Peak
            </Text>
            <Text>
            {data.lastHourPeak}     
            </Text>
        </View>


      </View>

      <Button title= "Click me"></Button>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
      },
      horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
      },
    mainView: {
        flex: 1,
        flexDirection: 'row',
        padding: 8
    },
    viewCard: {
        flex: 1,
        width: 100,
        height: 100,
        borderRadius: 4,
        margin: 8,
        alignItems: 'center',
        justifyContent: 'center'
    }
});