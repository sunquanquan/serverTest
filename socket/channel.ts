import { connection, IMessage } from "websocket";
import { MainLogic } from "../handler/mainLogic";

export class Channel {
    protected static _channel: Channel;
    public static getInstance(): Channel {
        if(!this._channel) {
            this._channel = new Channel();
        }
        return this._channel;
    }

    public initConn(connection: connection) {
        MainLogic.getInstance().setChannel(connection);
        connection.on("message", (msg: IMessage) => {
            if(msg.type == 'utf8') {
                MainLogic.getInstance().handlerMessage(msg);
            }
            if(msg.type == 'binary') {
                MainLogic.getInstance().handlerMessage(msg);
            }
        });

        connection.on("close", (code: number, desc: string) => {
            console.log("socket is close");
        })
    }
}