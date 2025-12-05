import { Text, StyleSheet, View } from 'react-native'
import React, { Component } from 'react'
import {MMKV} from 'react-native-mmkv'
import { useEffect, useState } from 'react'

import Initialized from './BillComponents/Initialized'
import NotInitialized from './BillComponents/NotInitialized'


      
export default function bills () {



    const storage = new MMKV()
    const [loading, setLoading] = useState(true) // Loading state
    const [initStatus, setInitStatus] = useState(false)//initializationState
    
    
    

    useEffect(() => { 
        //url and the route
        fetch('http://192.168.56.1:5000/get_billStatus', {
            method :'GET' //use GET method
    
        }) 
        .then(resp => resp.json()) //Converts response to the json
        //After response we receive actual data
        .then(jsonData => {
            setLoading(false)
            setInitStatus(jsonData);
          })
          .catch(error => {
            setLoading(false)
            console.error("Error fetching data:", error);
          });
    
    
        },[]);
    
    
        
        if (loading) {
            return <Text>Loading.....</Text>
        }

        if(initStatus){
            return <Initialized/>
        }

        else{
            return <NotInitialized/>
        }



 
}

const styles = StyleSheet.create({})