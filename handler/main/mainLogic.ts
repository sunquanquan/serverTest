import { IHandlerMessage } from "../../socket/IHandlerMessage";
import { IMessage, connection } from "websocket";
import { proto_login } from "../../protocol/message/proto_login";
import { LoginLogic } from "../login/loginLogic";
import { Channel } from "../../socket/channel";

export class MainLogic implements IHandlerMessage {

    // protected static _mainLogic: MainLogic;
    // public static getInstance(): MainLogic {
    //     if (!this._mainLogic) {
    //         this._mainLogic = new MainLogic();
    //     }
    //     return this._mainLogic;
    // }

    protected _connection?: connection;

    protected _channel?: Channel;

    public setChannel(channel: Channel) {
        this._channel = channel;
        this._channel.setHandler(this);
        this._connection = this._channel._conn;
    }

    public async handlerMessage(msg: IMessage) {
        let reqData: Buffer | undefined = msg.binaryData;
        if (!reqData) {
            return;
        }
        let actData = proto_login.MessageInit.getInstance().read(reqData);
        let key = proto_login.MessageInit.getInstance().commandKey;
        switch (actData[key]) {
            case proto_login.LoginC2S["name"]:
                new LoginLogic().handlerLogin(actData);
                break;
            default:
                break;
        }
    }
    public handlerClose(code: number, desc: string) {
        console.log("socket closed: code:" + code + "desc: " + desc);
    }
}