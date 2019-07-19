import { MainLogic } from "./main/mainLogic";
import { connection, IMessage } from "websocket";
import { proto_login } from "../protocol/message/proto_login";
import { UserData } from "../mysql/tables/user";

export class LogicBase {
    public _userData!: UserData;

    public _conn!: connection;
    constructor(mainLogic: MainLogic) {
        this.setConn(mainLogic._connection);
        mainLogic.pushLogicBase(this);
    }

    public setConn(conn?: connection) {
        if (conn) {
            this._conn = conn;
        }
    }

    public sendMsg(msg: any) {
        let sendBuf: Buffer = proto_login.MessageInit.getInstance().write(msg);
        this._conn.sendBytes(sendBuf);
    }
}