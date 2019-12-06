import { IHandlerMessage } from "../../common/socket/IHandlerMessage";
import { IMessage, connection } from "websocket";
import { Channel } from "../../common/socket/channel";
import { TestLogic } from "./test/testLogic";
import { BaseLogic } from "./baseLogic";
import { UserData } from "../../common/mysql/tables/user";
import { MessageInit } from "../../protocol/message/messageInit";
import { message } from "../../protocol/message/message";
import { Main } from "./main";
import { UserLogic } from "./user/userLogic";

export class UserMainLogic implements IHandlerMessage {
    private baseLogicArr: BaseLogic[] = [];
    private testLogic!: TestLogic;
    private userLogic!: UserLogic;

    public _connection?: connection;
    protected _channel?: Channel;
    public _uid!: string;

    public setLogic() {
        this.testLogic = new TestLogic(this);
        this.userLogic = new UserLogic(this);
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
                let userData: UserData = await this.userLogic.handlerLogin(actData);
                if(userData) {
                    this._uid = userData.id;
                    for (let baseLogic of this.baseLogicArr) {
                        baseLogic.setUserData(userData);
                    }
                    Main.getInstance().pushUserMap(this);
                }
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
    public sendMsg(msg: any) {
        let sendBuf: Buffer = MessageInit.getInstance().write(msg);
        if (this._connection) {
            this._connection.sendBytes(sendBuf);
        }
    }
}