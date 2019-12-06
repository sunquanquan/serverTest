import { IHandlerMessage } from "../../common/socket/IHandlerMessage";
import { IMessage, connection } from "websocket";
import { Channel } from "../../common/socket/channel";
import { TestLogic } from "./test/testLogic";
import { BaseLogic } from "./baseLogic";
import { UserData, UserDataTab } from "../../common/mysql/tables/user";
import { v1 } from 'uuid';
import { MessageInit } from "../../protocol/message/messageInit";
import { message } from "../../protocol/message/message";
import { Main } from "./main";

export class UserMainLogic implements IHandlerMessage {
    public baseLogicArr: BaseLogic[] = [];
    private testLogic!: TestLogic;

    public _connection?: connection;
    protected _channel?: Channel;
    public _uid!: string;

    public setLogic() {
        this.testLogic = new TestLogic(this);
    }

    public pushBaseLogic(baseLogic: BaseLogic) {
        this.baseLogicArr.push(baseLogic);
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
                    this.testLogic.handlerTest(actData);
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
        this._uid = userData.id;
        for (let baseLogic of this.baseLogicArr) {
            baseLogic.setUserData(userData);
        }
        Main.getInstance().pushUserMap(this);

        // 存库
        UserDataTab.getInstance().insert(userData);

        let resData: message.LoginS2C = new message.LoginS2C();
        resData.code = 1;
        // 返回
        this.sendMsg(resData);
    }

    public sendMsg(msg: any) {
        let sendBuf: Buffer = MessageInit.getInstance().write(msg);
        if (this._connection) {
            this._connection.sendBytes(sendBuf);
        }
    }
}