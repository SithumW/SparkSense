# SparkSense 💡

**SparkSense** is a comprehensive IoT-based electrical energy monitoring system that tracks real-time power consumption and provides detailed analytics. Perfect for home energy management and cost optimization.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Mobile Application
- 📊 **Real-time Power Monitoring** - Track current electricity consumption in real-time
- 💰 **Bill Management** - Track and manage electricity bills with detailed breakdowns
- 📈 **Historical Analytics** - View usage statistics and trends over time
- 🎨 **Interactive Charts** - Visualize energy consumption with intuitive charts
- ⚙️ **Customizable Settings** - Configure monitoring preferences and alerts
- 🔔 **Usage Alerts** - Get notified when consumption exceeds thresholds

### Backend System
- 🗄️ **Cloud Database** - AWS DynamoDB for scalable data storage
- 📅 **Data Aggregation** - Hourly and monthly energy consumption summaries
- 🔌 **REST API** - RESTful endpoints for data access and management
- ⚡ **Real-time Updates** - WebSocket support for live data streaming
- 🔐 **Secure Communication** - AWS IoT integration for device authentication

### Hardware Device
- 🔋 **Current Measurement** - Adafruit ADS1115 ADC for accurate electrical current sensing
- 📡 **WiFi Connectivity** - ESP8266/NodeMCU microcontroller with WiFi capabilities
- 🔌 **MQTT Protocol** - Reliable device-to-cloud communication
- ⚡ **Low Power** - Optimized for continuous monitoring with minimal power consumption

## 📁 Project Structure

```
SparkSense/
├── Screens/                    # React Native screen components
│   ├── Home.js                # Home screen with current status
│   ├── Bill.js                # Bill management screen
│   ├── Statistics.js          # Statistics and analytics screen
│   ├── Settings.js            # App settings and configuration
│   └── Components/            # Reusable UI components
│       ├── CurrentStatus.tsx  # Current power consumption display
│       ├── Bills.tsx          # Bill list and details
│       └── StatisticsData.tsx # Statistics visualizations
├── BackendDev/                # Backend and hardware code
│   ├── PythonFlask/           # Flask API server
│   │   ├── backendServer.py   # Main Flask application
│   │   └── requirements.txt   # Python dependencies
│   └── NodeMCU/               # Arduino firmware
│       └── Main/
│           └── Main.ino       # ESP8266/NodeMCU firmware
├── android/                   # Android native code
├── ios/                       # iOS native code
├── App.tsx                    # Main React Native app component
├── app.json                   # React Native configuration
├── package.json               # JavaScript dependencies
└── README.md                  # This file
```

## 🛠 Tech Stack

### Frontend
- **React Native** (0.74.3) - Cross-platform mobile development
- **TypeScript** (5.0.4) - Type-safe JavaScript
- **React Navigation** - App routing and navigation
- **React Native Chart Kit** - Data visualization
- **Axios** - HTTP client

### Backend
- **Python Flask** - Lightweight web framework
- **AWS DynamoDB** - NoSQL database
- **AWS IoT Core** - Device management and MQTT broker
- **Boto3** - AWS SDK for Python

### Hardware
- **Arduino** - Device firmware development
- **NodeMCU/ESP8266** - Microcontroller platform
- **Adafruit ADS1115** - 16-bit ADC for current sensing
- **PubSubClient** - MQTT client library

### Real-time Communication
- **Socket.io** - WebSocket support for live updates
- **MQTT** - Lightweight pub/sub protocol

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Python** (3.8 or higher) for backend
- **React Native CLI**
- **Android Studio** (for Android development)
- **Xcode** (for iOS development on macOS)
- **Arduino IDE** (for hardware development)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/SithumW/SparkSense.git
cd SparkSense
```

#### 2. Install Frontend Dependencies
```bash
npm install
# or
yarn install
```

#### 3. Install Backend Dependencies
```bash
cd BackendDev/PythonFlask
pip install -r requirements.txt
cd ../..
```

#### 4. Configure AWS Credentials
Set up your AWS credentials as environment variables:
```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=eu-north-1
```

#### 5. Hardware Setup
- Upload the firmware to NodeMCU using Arduino IDE
- Configure WiFi credentials in `BackendDev/NodeMCU/Main/secrets.h`
- Update MQTT broker details for AWS IoT Core

### Running the Application

#### Start Metro Bundler
```bash
npm start
# or
yarn start
```

#### Run on Android
```bash
npm run android
# or
yarn android
```

#### Run on iOS (macOS only)
```bash
npm run ios
# or
yarn ios
```

#### Start Backend Server
```bash
cd BackendDev/PythonFlask
python backendServer.py
```

## 🏗 Architecture

SparkSense follows a three-tier architecture:

```
┌─────────────────┐
│  Mobile App     │  React Native
│  (Frontend)     │  ↓ HTTP/WebSocket
└─────────────────┘
         ↓
┌─────────────────┐
│  Flask API      │  Python Flask
│  (Backend)      │  ↓ AWS SDK
└─────────────────┘
         ↓
┌─────────────────┐
│  AWS Services   │  DynamoDB + IoT Core
│  (Cloud)        │  ↑ MQTT
└─────────────────┘
         ↑
┌─────────────────┐
│  NodeMCU Device │  Arduino/ESP8266
│  (Hardware)     │
└─────────────────┘
```

## ⚙️ Configuration

### Mobile App Configuration
Edit `app.json` to configure:
- App name and display settings
- Bundle identifier
- Version number

### Backend Configuration
Configure in `BackendDev/PythonFlask/backendServer.py`:
- AWS region and credentials
- DynamoDB table names
- MQTT broker settings
- API endpoints

### Hardware Configuration
Edit `BackendDev/NodeMCU/Main/secrets.h`:
- WiFi SSID and password
- AWS IoT endpoint
- Device certificate and keys
- Current sensor calibration factor

## 📝 Testing

Run tests with:
```bash
npm test
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Sithum W** - [GitHub](https://github.com/SithumW)

## 📞 Support

For support, email or open an issue on the GitHub repository.

---
