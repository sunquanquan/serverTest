import { message } from "../../../protocol/message/message";
import { UserData } from "../../../common/mysql/tables/user";
import { MainLogic } from "../main/mainLogic";
import { LogicBase } from "../logicBase";

export class TestLogic extends LogicBase {

    public aa: number = 0;

    constructor(mainLogic: MainLogic) {
        super(mainLogic);
    }

    handlerLogin(msg: message.TestC2S) {
        console.log("test logic.......");
        console.log(msg);
        let userData: UserData = this._userData;
        console.log(userData);
    }
}