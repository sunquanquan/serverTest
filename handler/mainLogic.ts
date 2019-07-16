import { IHandlerMessage } from "../socket/IHandlerMessage";
import { IMessage, connection } from "websocket";
import { UserDataTab } from "../mysqlTables/user";

export class MainLogic implements IHandlerMessage {

    protected static _mainLogic: MainLogic;
    public static getInstance(): MainLogic {
        if (!this._mainLogic) {
            this._mainLogic = new MainLogic()
        }
        return this._mainLogic;
    }

    protected _connection?: connection;

    public setChannel(connection: connection) {
        this._connection = connection;
    }

    public async handlerMessage(msg: IMessage) {
        console.log("get message: " + JSON.stringify(msg));
        const user = new UserDataTab();
        // user.create((err: Error, result: any, field: any) => {
        //     console.log(err);
        //     console.log(result);
        //     console.log(field);
        // });
        // user.insert(user.defaultValue,(err: Error, result: any, field: any) => {
        //     console.log(err);
        //     console.log(result);
        //     console.log(field);
        // })
        // user.fetchAll((err: Error, result: any, field: any) => {
        //     console.log(err);
        //     console.log(result);
        //     console.log(field);
        // });
        // user.fetch({nickname: 'sss'},(err: Error, result: any, field: any) => {
        //     console.log(err);
        //     console.log(result);
        //     console.log(field);
        // });
    }
    public handlerClose(code: number, desc: string) {
        console.log("socket closed: code:" + code + "desc: " + desc);
    }
}