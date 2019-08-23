import { IHandlerMessage } from "../../socket/IHandlerMessage";
import { IMessage, connection } from "websocket";
import { LoginLogic } from "../login/loginLogic";
import { Channel } from "../../socket/channel";
import { TestLogic } from "../login/testLogic";
import { LogicBase } from "../logicBase";
import { UserData, UserDataTab } from "../../mysql/tables/user";
import { v1 } from 'uuid';
import { MessageInit } from "../../protocol/message/messageInit";
import { proto } from "../../protocol/message/proto";

export class MainLogic implements IHandlerMessage {
    public logicBaseArr: LogicBase[] = [];
    public loginLogic!: LoginLogic;
    public testLogic!: TestLogic;

    public _connection?: connection;
    protected _channel?: Channel;

    public setLogic() {
        this.loginLogic = new LoginLogic(this);
        this.testLogic = new TestLogic(this);
    }

    public pushLogicBase(logicBase: LogicBase) {
        this.logicBaseArr.push(logicBase);
    }

    public setChannel(channel: Channel) {
        this._channel = channel;
        this._channel.setHandler(this);
        this._connection = this._channel._conn;
        this.setLogic();
    }

    public async handlerMessage(msg: IMessage) {
        let reqData: Buffer | undefined = msg.binaryData;
        if (!reqData) {
            return;
        }
        let actData = MessageInit.getInstance().read(reqData);
        let key = MessageInit.getInstance().commandKey;
        switch (actData[key]) {
            case proto.LoginC2S["name"]:
                if (this.loginLogic) {
                    // this.loginLogic.handlerLogin(actData);
                    this.handlerLogin(actData);
                }
                break;
            case proto.TestC2S["name"]:
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

    public handlerLogin(msg: proto.LoginC2S) {
        let userData: UserData = new UserData();
        userData.id = v1();
        userData.nickname = msg.username;
        userData.password = msg.password;
        userData.createTime = new Date().getTime().toString();
        UserDataTab.getInstance().insert(userData);
        let resData: proto.LoginS2C = new proto.LoginS2C();
        resData.code = 1;
        for (let baseLogic of this.logicBaseArr) {
            baseLogic.setUserData(userData);
        }
        this.sendMsg(resData);
    }

    public sendMsg(msg: any) {
        let sendBuf: Buffer = MessageInit.getInstance().write(msg);
        if (this._connection) {
            this._connection.sendBytes(sendBuf);
        }
    }
}