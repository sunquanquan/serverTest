import { IHandlerMessage } from "../../../common/socket/IHandlerMessage";
import { IMessage, connection } from "websocket";
import { Channel } from "../../../common/socket/channel";
import { TestLogic } from "../test.ts/testLogic";
import { LogicBase } from "../logicBase";
import { UserData, UserDataTab } from "../../../common/mysql/tables/user";
import { v1 } from 'uuid';
import { MessageInit } from "../../../protocol/message/messageInit";
import { message } from "../../../protocol/message/message";

export class MainLogic implements IHandlerMessage {
    public logicBaseArr: LogicBase[] = [];
    public testLogic!: TestLogic;

    public _connection?: connection;
    protected _channel?: Channel;

    public setLogic() {
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
            case message.LoginC2S["name"]:
                this.handlerLogin(actData);
                break;
            case message.TestC2S["name"]:
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

    public handlerLogin(msg: message.LoginC2S) {
        let userData: UserData = new UserData();
        userData.id = v1();
        userData.nickname = msg.username;
        userData.password = msg.password;
        userData.createTime = new Date().getTime().toString();
        UserDataTab.getInstance().insert(userData);
        let resData: message.LoginS2C = new message.LoginS2C();
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