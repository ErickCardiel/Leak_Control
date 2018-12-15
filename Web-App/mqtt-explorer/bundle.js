(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){


var awsConfiguration = {
   poolId: 'xxxxx',   // 'YourCognitoIdentityPoolId'
   host: 'xxxxxxx',   // 'YourAwsIoTEndpoint', e.g. 'prefix.iot.us-east-1.amazonaws.com'
   region: 'xxxx'     // 'YourAwsRegion', e.g. 'us-east-1'
};
module.exports = awsConfiguration;


},{}],2:[function(require,module,exports){
/*
 * Copyright 2015-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

// Instantiate the AWS SDK and configuration objects.  The AWS SDK for 
// JavaScript (aws-sdk) is used for Cognito Identity/Authentication, and 
// the AWS IoT SDK for JavaScript (aws-iot-device-sdk) is used for the
// WebSocket connection to AWS IoT and device shadow APIs.

var AWS = require('aws-sdk');
var AWSIoTData = require('aws-iot-device-sdk');
var AWSConfiguration = require('./aws-configuration.js');

console.log('Loaded AWS SDK for JavaScript and AWS IoT SDK for Node.js');

// Remember our current subscription topic here.
const currentlySubscribedTopic = '$aws/things/Ultimo/shadow/update';


// Remember our message history here.
var messageHistory = '';

// Create a client id to use when connecting to AWS IoT.
var clientId = 'mqtt-explorer-' + (Math.floor((Math.random() * 100000) + 1));

// Initialize our configuration.
AWS.config.region = AWSConfiguration.region;

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
   IdentityPoolId: AWSConfiguration.poolId
});


// Create the AWS IoT device object.  Note that the credentials must be 
// initialized with empty strings; when we successfully authenticate to
// the Cognito Identity Pool, the credentials will be dynamically updated.
mqttClient = AWSIoTData.device({
   // Set the AWS region we will operate in.
   region: AWS.config.region,
   //
   ////Set the AWS IoT Host Endpoint
   host:AWSConfiguration.host,
   // Use the clientId created earlier.
   clientId: clientId,
   // Connect via secure WebSocket
   protocol: 'wss',
   // Set the maximum reconnect time to 8 seconds; this is a browser application
   // so we don't want to leave the user waiting too long for reconnection after
   // re-connecting to the network/re-opening their laptop/etc...
   maximumReconnectTimeMs: 8000,
   // Enable console debugging information (optional)
   debug: true,

   // IMPORTANT: the AWS access key ID, secret key, and sesion token must be 
   // initialized with empty strings.
   accessKeyId: '',
   secretKey: '',
   sessionToken: ''
});

// Attempt to authenticate to the Cognito Identity Pool.  Note that this
// example only supports use of a pool which allows unauthenticated 
// identities.

var cognitoIdentity = new AWS.CognitoIdentity();

AWS.config.credentials.get(function(err, data) {
   if (!err) {
      console.log('retrieved identity: ' + AWS.config.credentials.identityId);
      var params = {
         IdentityId: AWS.config.credentials.identityId
      };
      cognitoIdentity.getCredentialsForIdentity(params, function(err, data) {
         if (!err) {
 
            // Update our latest AWS credentials; the MQTT client will use these
            // during its next reconnect attempt.
 
            mqttClient.updateWebSocketCredentials(data.Credentials.AccessKeyId,
               data.Credentials.SecretKey,
               data.Credentials.SessionToken);
         } else {
            console.log('error retrieving credentials: ' + err);
            alert('error retrieving credentials: ' + err);
         }
      });
   } else {
      console.log('error retrieving identity:' + err);
      alert('error retrieving identity: ' + err);
   }
});

// Connect handler; update div visibility and fetch latest shadow documents.
// Subscribe to lifecycle events on the first connect event.

function myFunction() {
    if (confirm("Press a button!")) {
         updatePublishData(1);
        console.log("You pressed OK!");

    } else {
        console.log("You pressed Cancel!");
        updatePublishData(0);
    }
}


window.mqttClientConnectHandler = function() {
   console.log('connect');
   document.getElementById("connecting-div").style.visibility = 'hidden';
   document.getElementById("explorer-div").style.visibility = 'visible';
   document.getElementById('subscribe-div').innerHTML = '<p><br></p>';
   messageHistory = '';

   // Subscribe to our current topic.
   mqttClient.subscribe(currentlySubscribedTopic);
};

// Reconnect handler; update div visibility.
window.mqttClientReconnectHandler = function() {
   console.log('reconnect');
   document.getElementById("connecting-div").style.visibility = 'visible';
   document.getElementById("explorer-div").style.visibility = 'hidden';
};

// Utility function to determine if a value has been defined.
window.isUndefined = function(value) {
   return typeof value === 'undefined' || typeof value === null;
};


// Message handler for lifecycle events; create/destroy divs as clients
// connect/disconnect.
var prevMedition = -1;
var prevTime = -1;

window.mqttClientMessageHandler = function(topic, payload) {
   var obj = JSON.parse(payload);
 
   messageHistory = messageHistory + topic + ':' + payload.toString() + '</br>';
   document.getElementById('subscribe-div').innerHTML = '<p>' + messageHistory + '</p>';
   
   var obj = JSON.parse(payload);

   if(obj.state.reported.pipe.possibleLeak == 1)
   {
      $('#myModal').modal('show');
   }

   if(obj.state.reported.pipe.totalm3water != prevMedition)
   {
      if(obj.state.reported.newMedition != prevTime)   
      {
         meditions.pulses = 1;
         meditions.time = obj.state.reported.newMedition.replace("-", ":");
         AddNewPoint();
      }
      else
      {
         meditions.pulses++;
         updateDataPoint();
      }
      console.log(meditions);
   }
   prevTime = obj.state.reported.newMedition;
   prevMedition = obj.state.reported.pipe.totalm3water;
};


// Handle the UI to clear the history window
window.clearHistory = function() {
   if (confirm('Delete message history?') === true) {
      document.getElementById('subscribe-div').innerHTML = '<p><br></p>';
      messageHistory = '';
   }
};


// Handle the UI to update the topic we're publishing on
window.updatePublishTopic = function() {};


// Publish to open the pipe
window.updatePublishData = function(opc) {
   if(opc)
   {
      console.log("opc = 1 ");
      mqttClient.publish(publishTopic, "{\"state\":{\"reported\":{\"closePipe\" : 1}}}");
   }
};


// Install connect/reconnect event handlers.
mqttClient.on('connect', window.mqttClientConnectHandler);
mqttClient.on('reconnect', window.mqttClientReconnectHandler);
mqttClient.on('message', window.mqttClientMessageHandler);


// Initialize divs.
window.parent.document.title = "Leak Control";
var conectingDiv = document.getElementById('connecting-div');
var explorerDiv = document.getElementById('explorer-div');
if(conectingDiv && explorerDiv)
{
   conectingDiv.style.visibility = 'visible';
   explorerDiv.style.visibility = 'hidden';
   conectingDiv.innerHTML = '<p>attempting to connect to aws iot...</p>';
}



},{"./aws-configuration.js":1,"aws-iot-device-sdk":"aws-iot-device-sdk","aws-sdk":"aws-sdk"}]},{},[2]);
