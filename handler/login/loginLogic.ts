import { proto_login } from "../../protocol/message/proto_login";
import { UserDataTab, UserData } from "../../mysql/tables/user";
import { v1 } from 'uuid';

export class LoginLogic {

    public aa: number = 0;

    handlerLogin(msg: proto_login.LoginC2S) {
        let userData: UserData = new UserData();
        userData.id = v1();
        userData.nickname = msg.username;
        userData.password = msg.password;
        userData.createTime = new Date().getTime().toString();
        UserDataTab.getInstance().insert(userData);
        this.aa++;
        console.log(this.aa);
    }
}