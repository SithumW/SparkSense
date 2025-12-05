SparkSense is a comprehensive IoT-based electrical energy monitoring system that tracks real-time power consumption and provides detailed analytics.

The project consists of three main components:

Mobile App (React Native): A cross-platform mobile application built with React Native featuring real-time current monitoring, energy bills tracking, historical statistics, and system settings
Backend (Python Flask): REST API server integrated with AWS DynamoDB for data storage, processing hourly and monthly aggregated energy data
Hardware (Arduino/NodeMCU): IoT device firmware using Adafruit ADS1115 ADC to measure electrical current and transmit data via WiFi to the backend using MQTT/AWS IoT
The application provides users with insights into their electricity usage through interactive charts, bill management, and customizable alerts. Perfect for home energy management and cost optimization.

Tech Stack: React Native, TypeScript, Python Flask, AWS DynamoDB, Arduino/NodeMCU, Socket.io, Axios

