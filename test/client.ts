#!/usr/bin/env node

import { proto_login } from "../protocol/message/proto_login";

var WebSocketClient = require('websocket').client;

function clientConn(username: string, password: string) {

    var client = new WebSocketClient();

    client.on('connectFailed', function (error: any) {
        console.log('Connect Error: ' + error.toString());
    });

    client.on('connect', function (connection: any) {
        console.log('WebSocket Client Connected');

        proto_login.MessageInit.getInstance().init();

        connection.on('error', function (error: any) {
            console.log("Connection Error: " + error.toString());
        });
        connection.on('close', function () {
            console.log('echo-protocol Connection Closed');
        });
        connection.on('message', function (message: any) {
            if (message.type === 'utf8') {
                console.log("Received: '" + message.utf8Data + "'");
            }
        });

        if (connection.connected) {
            let sendData: proto_login.LoginC2S = new proto_login.LoginC2S();
            sendData.username = username;
            sendData.password = password;
            connection.sendBytes(proto_login.MessageInit.getInstance().write(sendData));
        }
    });
    client.connect('ws://localhost:3000/', 'echo-protocol');
}

let password = "123456";
for (let i = 0; i < 2; i++) {
    let username = "sun_" + i;
    clientConn(username, password);
}
