import React, { useEffect, useState } from 'react';
import { View, Text,Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import axios from 'axios';


  type DataType = {
    "Watt-Hour": number;
    DateTime: string;
  };
  

  
  const screenWidth = Dimensions.get('window').width; // Get screen width

  const DataBarGraph = () => {
    const [dataHour, setDataHour] = useState<DataType[]>([]); // Type defined here

    const [dataDay, setDataDay] = useState<DataType[]>([]); // Type defined here

    const [dataMonth, setDataMonth] = useState<DataType[]>([]); // Type defined here

    const [loading, setLoading] = useState(true) // Loading state


    useEffect(() => {
      const fetchData = async () => {
        try {
          // Concurrently fetching both endpoints using Promise.all
          const [response1, response2,response3] = await Promise.all([
            axios.get('http://192.168.56.1:5000/Hourdata'),
            axios.get('http://192.168.56.1:5000/DayData'),
            axios.get('http://192.168.56.1:5000/MonthData')  // Replace with your second endpoint
          ]);
  
          // Set the data for each response
          setDataHour(response1.data);
          setDataDay(response2.data); // Store data from the second endpoint if needed
          setDataMonth(response3.data);
          setLoading(false);

          console.log("First API response:", response1.data);
          console.log("Second API response:", response2.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      // Call fetchData function
      fetchData();
    },


  
  
  
  
  
  
  
  []);


  if (loading) {
    return <Text>Loading.....</Text>
}

  // Transform data for the chart
  const chartDataHour = {
    labels: dataHour.length > 0 ? dataHour.map(item => item.DateTime) : ['No data'],
    datasets: [
      {
        data: dataHour.length > 0 ? dataHour.map(item => item["Watt-Hour"]) : [0],
      },
    ],
  }
  
  const chartDataDay = {
    labels: dataDay.length > 0 ? dataDay.map(item => item.DateTime) : ['No data'],
    datasets: [
      {
        data: dataDay.length > 0 ? dataDay.map(item => item["Watt-Hour"]) : [0],
      },
    ],
  }

  const chartDataMonth = {
    labels: dataMonth.length > 0 ? dataMonth.map(item => item.DateTime) : ['No data'],
    datasets: [
      {
        data: dataMonth.length > 0 ? dataMonth.map(item => item["Watt-Hour"]) : [0],
      },
    ],
  }

  ;

  return (
    <View>
      <Text>Hourly Data</Text>
      <LineChart
  data={chartDataHour}
  width={screenWidth}
  height={220}
  yAxisSuffix="Wh" 
  fromZero={true}
  withDots = {false}
  withVerticalLabels = {false}
  chartConfig={{
    backgroundColor: "#5dade2",
    backgroundGradientFrom: "#1b4f72",
    backgroundGradientTo: "#5dade2",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
  }}
  verticalLabelRotation={30}
/>


<Text>Day Data</Text>
      <LineChart
  data={chartDataDay}
  width={screenWidth}
  height={220}
  yAxisSuffix="Wh" 
  fromZero={true}
  withDots = {false}
  withVerticalLabels = {false}
  chartConfig={{
    backgroundColor: "#5dade2",
    backgroundGradientFrom: "#1b4f72",
    backgroundGradientTo: "#5dade2",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
  }}
  verticalLabelRotation={30}
/>

<Text>Month Data</Text>
      <LineChart
  data={chartDataMonth}
  width={screenWidth}
  height={220}
  yAxisSuffix="Wh" 
  fromZero={true}
  withDots = {false}
  withVerticalLabels = {false}
  chartConfig={{
    backgroundColor: "#5dade2",
    backgroundGradientFrom: "#1b4f72",
    backgroundGradientTo: "#5dade2",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
  }}
  verticalLabelRotation={30}
/>



    </View>
  );
};

export default DataBarGraph;