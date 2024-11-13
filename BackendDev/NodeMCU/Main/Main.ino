//AWS 
#include <WiFi.h>
#include <NetworkClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <time.h>
#include "Secrets.h"




//Current 
#include <Wire.h>
#include <Adafruit_ADS1X15.h>

Adafruit_ADS1115 ads;

const float FACTOR = 30; //20A/1V from teh CT

const float multiplier = 0.00005;


 float totalJoulesMin = 0;

//#define DHTPIN 2        // Digital pin connected to the DHT sensor
//#define DHTTYPE DHT11   // DHT 11
//
//DHT dht(DHTPIN, DHTTYPE);
//
//float h;
//float t;



unsigned long lastMillis = 0;
const long interval = 5000;

#define AWS_IOT_PUBLISH_TOPIC   "ESP32_AWSDB/pub"
#define AWS_IOT_SUBSCRIBE_TOPIC "ESP32_AWSDB/sub"

NetworkClientSecure net;

PubSubClient client(net);

time_t now;
time_t nowish = 1510592825;
struct tm timeinfo;
#define TIME_ZONE 5.3

void NTPConnect(void) {
    Serial.print("Setting time using SNTP");
    Serial.println(TIME_ZONE);
    configTime(TIME_ZONE * 3600, 0 * 3600, "pool.ntp.org", "time.nist.gov");
    now = time(nullptr);
    while (now < nowish) {
        delay(500);
        Serial.print(".");
        now = time(nullptr);
    }
    Serial.println("done!");

    gmtime_r(&now, &timeinfo);
    timeinfo.tm_hour = (timeinfo.tm_hour + 5) % 24;
    timeinfo.tm_min = (timeinfo.tm_min + 30) % 60;

    
    Serial.print("Current time SL: ");
    Serial.print(asctime(&timeinfo));
    
}

void setDateTime(){
    gmtime_r(&now, &timeinfo);
    timeinfo.tm_hour = (timeinfo.tm_hour + 5) % 24;
    timeinfo.tm_min = (timeinfo.tm_min + 30) % 60;

}


void messageReceived(char *topic, byte *payload, unsigned int length) {
    Serial.print("Received [");
    Serial.print(topic);
    Serial.print("]: ");
    for (int i = 0; i < length; i++) {
        Serial.print((char)payload[i]);
    }
    Serial.println();
}

void connectAWS() {
    delay(3000);
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.println(String("Attempting to connect to SSID: ") + String(WIFI_SSID));

    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(1000);
    }

    NTPConnect();

    // Set the certificates for secure connection
    net.setCACert(cacert);          // Root CA certificate
    net.setCertificate(client_cert); // Client certificate
    net.setPrivateKey(privkey);      // Private key

    client.setServer(MQTT_HOST, 8883);
    client.setCallback(messageReceived);

    Serial.println("Connecting to AWS IOT");

    while (!client.connect(THINGNAME)) {
        Serial.print(".");
        delay(1000);
    }

    if (!client.connected()) {
        Serial.println("AWS IoT Timeout!");
        return;
    }

    client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);
    Serial.println("AWS IoT Connected!");
}

void publishMessage(float value) {
    setDateTime();
    StaticJsonDocument<200> doc;
    doc["TimeStamp"] = asctime(&timeinfo);
    Serial.println(asctime(&timeinfo));
    doc["Watt-Hour"] = value;
    char jsonBuffer[512];
    serializeJson(doc, jsonBuffer);

    client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
}



//Current
float getcurrent()
{
  float voltage;
  float current;
  float sum = 0;
  long time_check = millis();
  int counter = 0;

  while (millis() - time_check < 1000)
  {
    voltage = ads.readADC_Differential_0_1() * multiplier;
    current = voltage * FACTOR;
    //current /= 1000.0;

    sum += sq(current);
    counter = counter + 1;
  }

  current = sqrt(sum / counter);
  return (current);
}







void setup() {
    Serial.begin(115200);
    connectAWS();



//Current
  ads.setGain(GAIN_FOUR);      // +/- 1.024V 1bit = 0.5mV
  ads.begin();
    
}

void loop() {

 float currentRMS = getcurrent();
 
 totalJoulesMin = totalJoulesMin + 230 * currentRMS;
 
//
//    if (isnan(h) || isnan(t)) {
//        Serial.println(F("Failed to read from DHT sensor!"));
//        return;
//    }

    setDateTime();
    Serial.print("Current time: ");
    Serial.print(asctime(&timeinfo));
    Serial.print("Irms: ");
    Serial.print(currentRMS);
    Serial.println("A");
    Serial.println("Joules :");
    Serial.println(totalJoulesMin);
    
  

    now = time(nullptr);

    if (!client.connected()) {
        connectAWS();
    } else {
        client.loop();
        if (millis() - lastMillis > 60000) {
            lastMillis = millis();
            float WattHour = totalJoulesMin / 3600; 
            publishMessage(WattHour);
            totalJoulesMin = 0;
        }
    }
}
