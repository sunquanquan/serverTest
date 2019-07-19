import { IHandlerMessage } from "../../socket/IHandlerMessage";
import { IMessage, connection } from "websocket";
import { proto_login } from "../../protocol/message/proto_login";
import { LoginLogic } from "../login/loginLogic";
import { Channel } from "../../socket/channel";
import { TestLogic } from "../login/testLogic";
import { LogicBase } from "../logicBase";

export class MainLogic implements IHandlerMessage {

    // protected static _mainLogic: MainLogic;
    // public static getInstance(): MainLogic {
    //     if (!this._mainLogic) {
    //         this._mainLogic = new MainLogic();
    //     }
    //     return this._mainLogic;
    // }
    public logicBaseArr: LogicBase[] = [];
    public loginLogic?: LoginLogic;
    public testLogic?: TestLogic;

    public _connection?: connection;
    protected _channel?: Channel;

    public pushLogicBase(logicBase: LogicBase) {
        this.logicBaseArr.push(logicBase);
    }

    public setChannel(channel: Channel) {
        this._channel = channel;
        this._channel.setHandler(this);
        this._connection = this._channel._conn;
        if (!this.loginLogic) {
            this.loginLogic = new LoginLogic(this);
        }
        if (!this.testLogic) {
            this.testLogic = new TestLogic(this);
        }
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
                if (this.loginLogic) {
                    this.loginLogic.handlerLogin(actData);
                }
                break;
            case proto_login.TestC2S["name"]:
                if (this.testLogic) {
                    this.testLogic.handlerLogin(actData);
                }
                break;
            default:
                break;
        }
    }
    public handlerClose(code: number, desc: string) {
        console.log("socket closed: code:" + code + "desc: " + desc);
    }
}