import { connection, IMessage } from "websocket";

export class Channel {
    public _conn!: connection;
    protected _handler: any;

    public setHandler(mainLogic: any) {
        this._handler = mainLogic;
    }

    public initConn(connection: connection) {
        this._conn = connection;
        this._conn.on("message", (msg: IMessage) => {
            if(msg.type == 'utf8') {
                this._handler.handlerMessage(msg);
            }
            if(msg.type == 'binary') {
                this._handler.handlerMessage(msg);
            }
        });

        this._conn.on("close", (code: number, desc: string) => {
            console.log("socket is close");
        })
    }
}