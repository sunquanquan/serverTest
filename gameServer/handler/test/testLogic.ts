import { message } from "../../../protocol/message/message";
import { UserData } from "../../../common/mysql/tables/user";
import { UserMainLogic } from "../userMainLogic";
import { BaseLogic } from "../baseLogic";

export class TestLogic extends BaseLogic {

    constructor(userMainLogic: UserMainLogic) {
        super(userMainLogic);
    }

    public handlerTest(msg: message.TestC2S) {
        console.log("test logic.......");
        console.log(msg);
        let userData: UserData = this._userData;
        console.log(userData);
    }
}