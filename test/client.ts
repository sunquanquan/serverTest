#!/usr/bin/env node

import { proto_login } from "../protocol/message/proto_login";

var WebSocketClient = require('websocket').client;
 
var client = new WebSocketClient();
 
client.on('connectFailed', function(error: any) {
    console.log('Connect Error: ' + error.toString());
});
 
client.on('connect', function(connection: any) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error: any) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message: any) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });
    
    // function sendNumber() {
        if (connection.connected) {
            let sendData: proto_login.LoginC2S = new proto_login.LoginC2S();
            sendData.username = "aa";
            sendData.password = "12";
            connection.sendUTF(JSON.stringify(sendData));
            // setTimeout(sendNumber, 1000);
        }
    // }
    // sendNumber();
});
 
client.connect('ws://localhost:3000/', 'echo-protocol');