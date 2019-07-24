import { MainLogic } from "./main/mainLogic";
import { connection, IMessage } from "websocket";
import { UserData } from "../mysql/tables/user";
import { MessageInit } from "../protocol/message/messageInit";

export class LogicBase {
    public _userData!: UserData;

    public _conn!: connection;
    constructor(mainLogic: MainLogic) {
        this.setConn(mainLogic._connection);
        mainLogic.pushLogicBase(this);
    }

    public setConn(conn?: connection): void {
        if (conn) {
            this._conn = conn;
        }
    }

    public setUserData(userData: UserData): void {
        this._userData = userData;
    }

    public getUserData(): UserData {
        return this._userData;
    }

    public sendMsg(msg: any) {
        let sendBuf: Buffer = MessageInit.getInstance().write(msg);
        this._conn.sendBytes(sendBuf);
    }
}