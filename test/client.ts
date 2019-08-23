import { proto } from "../protocol/message/proto";
import { IMessage } from "websocket";
import { MessageInit } from "../protocol/message/messageInit";

var WebSocketClient = require('websocket').client;

function clientConn(username: string, password: string) {

    var client = new WebSocketClient();

    client.on('connectFailed', function (error: any) {
        console.log('Connect Error: ' + error.toString());
    });

    client.on('connect', function (connection: any) {
        console.log('WebSocket Client Connected');

        MessageInit.getInstance().init();

        connection.on('error', function (error: any) {
            console.log("Connection Error: " + error.toString());
        });
        connection.on('close', function () {
            console.log('echo-protocol Connection Closed');
        });
        connection.on('message', function (message: IMessage) {
            if (message.type === 'utf8') {
                console.log("Received: '" + message.utf8Data + "'");
            } else if(message.type === 'binary') {
                console.log("Received: '" + message.binaryData + "'");
                if (!message.binaryData) {
                    return;
                }
                let actData = MessageInit.getInstance().read(message.binaryData);
                console.log(actData);
            }
        });

        if (connection.connected) {
            let sendData: proto.LoginC2S = new proto.LoginC2S();
            sendData.username = username;
            sendData.password = password;
            connection.sendBytes(MessageInit.getInstance().write(sendData));

            setInterval(() => {
                let sendData: proto.TestC2S = new proto.TestC2S();
                sendData.username = username + "11111111111";
                connection.sendBytes(MessageInit.getInstance().write(sendData));
            }, 10000);
        }
    });
    client.connect('ws://localhost:3000/', 'echo-protocol');
}

let password = "123456";
for (let i = 0; i < 1; i++) {
    let username = "sun_" + i;
    clientConn(username, password);
}
