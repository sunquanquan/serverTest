import { connection, IMessage } from "websocket";
import { UserMainLogic } from "../../gameServer/handler/userMainLogic";

export class Channel {
    public _conn!: connection;
    protected _userMainLogic!: UserMainLogic;

    public setHandler(userMainLogic: UserMainLogic) {
        this._userMainLogic = userMainLogic;
    }

    public initConn(connection: connection) {
        this._conn = connection;
        this._conn.on("message", (msg: IMessage) => {
            if(msg.type == 'utf8') {
                this._userMainLogic.handlerMessage(msg);
            }
            if(msg.type == 'binary') {
                this._userMainLogic.handlerMessage(msg);
            }
        });

        this._conn.on("close", (code: number, desc: string) => {
            console.log("socket is close");
        })
    }
}