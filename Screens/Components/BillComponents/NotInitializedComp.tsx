import React from 'react'
import { Text, View, Modal, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';


export default function notInitialized() {
   
  
const [isModalVisible, setModalVisible] = useState(false);


const [dateData,setDateData] = useState ({})
const [targetData,setTargetData] = useState ()

const [usagetoDate, setUsagetodate] = useState()
const [billAmount, setbillAmount] = useState()
const [expectedAmount, setExpectedAmount] = useState()



const [Loading, setLoading] = useState(false);

const handleInputChangeDate = (field: string, value: string) => {
  setDateData(prevData => ({ ...prevData, [field]: value }));
  setLoading(true)
  //url and the route
  fetch('http://192.168.56.1:5000/getUsageUptoDate', {
    method :'POST', //use POST method
    headers : {
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify(dateData),
}) 

.then(resp => resp.json()) //Converts response to the json
//After response we receive actual data
.then(jsonData => {
    setLoading(false)
    setUsagetodate(jsonData.usagetoDate)
    setbillAmount(jsonData.billAmount)
    setExpectedAmount(jsonData.expectedAmount)
    setLoading(false)
  })
  .catch(error => {
    setLoading(false)
    console.error("Error fetching data:", error);
  });

 // console.log(SplashScreen)
 // if (SplashScreen) {
 //   SplashScreen.hide(); // Hide the splash screen
  //}

};


  
  
  
  
  
  
  
  if (Loading){
    return <Text>Loading...</Text>

  }
  

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Open Form</Text>
        </TouchableOpacity>
  
        {/* Modal Popup */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Your Details</Text>
  
              <TextInput
                style={styles.input}
                placeholder="Name"
                onChangeText={(value) => handleInputChange('name', value)}
                value={userData.name}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={(value) => handleInputChange('email', value)}
                value={userData.email}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                keyboardType="phone-pad"
                onChangeText={(value) => handleInputChange('phone', value)}
                value={userData.phone}
              />
  
              <View style={styles.buttonContainer}>
                <Button title="Submit" onPress={handleSubmit} />
                <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  
}






const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});