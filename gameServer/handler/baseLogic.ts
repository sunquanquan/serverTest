import { UserMainLogic } from "./userMainLogic";
import { connection } from "websocket";
import { UserData } from "../../common/mysql/tables/user";
import { MessageInit } from "../../protocol/message/messageInit";

export class BaseLogic {
    public _userData!: UserData;

    public _conn!: connection;
    constructor(userMainLogic: UserMainLogic) {
        this.setConn(userMainLogic._connection);
        userMainLogic.pushBaseLogic(this);
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