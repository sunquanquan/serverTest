import { proto_login } from "../../protocol/message/proto_login";
import { UserDataTab, UserData } from "../../mysql/tables/user";
import { v1 } from 'uuid';
import { MainLogic } from "../main/mainLogic";
import { LogicBase } from "../logicBase";

export class LoginLogic extends LogicBase {
    public aa: number = 0;

    constructor(mainLogic: MainLogic) {
        super(mainLogic);
    }

    handlerLogin(msg: proto_login.LoginC2S) {
        let userData: UserData = new UserData();
        userData.id = v1();
        userData.nickname = msg.username;
        userData.password = msg.password;
        userData.createTime = new Date().getTime().toString();
        UserDataTab.getInstance().insert(userData);
        this._userData = userData;
        this.aa++;
        console.log(this.aa);
        let resData: proto_login.LoginS2C = new proto_login.LoginS2C();
        resData.code = 1;
        this.sendMsg(resData);
    }
}