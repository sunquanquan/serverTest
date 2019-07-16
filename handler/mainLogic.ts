import { IHandlerMessage } from "../socket/IHandlerMessage";
import { IMessage, connection } from "websocket";
import User from "../mysqlTables/user";

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
        const user = new User();
        user.create((err: Error, result: any, field: any) => {
            console.log(err);
            console.log(result);
            console.log(field);
        });
        // await user.insert(
        //     <IField>{
        //         id: Date.now().toString(),
        //         nickname: "sundial dreams",
        //         email: "123@qq.com",
        //         password: "abcd",
        //         picture: "/static/img/test-head.jpg",
        //         position: "china",
        //         company: "bytedunce",
        //         description: "i am sundial dreams",
        //         text: "() => {}",
        //         createTime: Date.now().toString()
        //     }
        // )
        // const data = await user.fetchAll();
    }
    public handlerClose(code: number, desc: string) {
        console.log("socket closed: code:" + code + "desc: " + desc);
    }
}