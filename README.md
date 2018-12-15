# Leak Control
Leak Control is a product capable of detecting and controlling irregular flows in a water system via Amazon Web Services. The product was a project for Advanced Microprocesessors class.

## How does it work?
To measure the amount of water that passes through a pipe, we use a [water flow meter sensor](https://www.adafruit.com/product/828).
![enter image description here](https://lh3.googleusercontent.com/9YjHNqFvH08kZuoy-FPSBUxXaVIzwYxqxJh__lfaTq6uQQIbJzhTq1U88D3jwk5oAj-_S8dKmMIF "Water flow meter")


Readings of the water flow sensor are processesed by an ATmega328p Microcontroller (Board Pro Mini)
![328p](https://lh3.googleusercontent.com/Guplpv8lNMYcSwSc6oISN37Szvt3Zd1bQZiw4olbeiid_QgIofNvD_z36eD8acljUN9GhpwwzOAL "328p")


Once the readings are obtained, the ATmega328p Microcontroller will send them by serial to the WiFi Module ESP8266 (D1 mini), then, it will process and send them to the AWS endpoint.
![enter image description here](https://lh3.googleusercontent.com/HElydRhWFKxgBgo1LuWzFbtx6YxkAQS4EMuAEXv8WDuPgXRX8UURQDqM6D3Wigyxl8TRC1O3MOgs "ESP8266")


The user will be able to access a Web application, where he will be able to see the water consumption in real time.

In case an irregular flow is detected, it will alert the user.

The user has the possibility of controll a [solenoid valve](https://www.amazon.ca/Male-Magnetically-Latching-Solenoid-Valve/dp/B0113362S6) to open/close the flow of water in the valve, from the web app.


## Prerequisites
Prerequisites for **Arduino** (ESP8266 programming): 
- Arduino IDE
-  Board Manager for ESP8266 
- Headers
-- ESP8266WiFi.h
-- PubSubClient.h
-- time.h
> **Note:** In order to work don't forget to update your **credential and private key**, and the **shadow thing endpoint** in the .ino project.

Prerequisites for **AVR** (ATmega328p programming): 
- AVR IDE

Prerequisites for AWS:
- AWS Account
-- Create a **Thing** in AWS-IOT Core
-- Create and download their certificates and private/public key
> you can follow [this](http://recetastecnologicas.blogspot.com/2018/02/aws-iot-con-esp8266.html) tutorial.
- [AWS IOT-Device SDK JS](https://github.com/aws/aws-iot-device-sdk-js)

> **Note:** In order to work replace the folder **mqtt-explorer** in the AWS SDK-JS location:  *"/connect_device_package/aws-iot-device-sdk-js/examples/browser "*. Don't forget to update your **credential and private key**, and the **shadow thing endpoint** in the **config/bundle** javascript files.