import { UserMainLogic } from "../userMainLogic";
import { BaseLogic } from "../baseLogic";
import { message } from "../../../protocol/message/message";
import { UserData, UserDataTab } from "../../../common/mysql/tables/user";
import { v4 } from 'uuid';
import { resolve } from "dns";

export class UserLogic extends BaseLogic {
    constructor(userMainLogic: UserMainLogic) {
        super(userMainLogic);
    }

    public async handlerLogin(msg: message.LoginC2S): Promise<any> {
        let promise = new Promise(resolve => {
            UserDataTab.getInstance().fetch({nickname: msg.username}, (err: any, results: any, filed: any) => {
                let resData: message.LoginS2C = new message.LoginS2C();
                if(err || !results) {
                    let userData: UserData = new UserData();
                    userData.id = v4();
                    userData.nickname = msg.username;
                    userData.password = msg.password;
                    userData.createTime = new Date().getTime().toString();
                    
                    // 存库
                    UserDataTab.getInstance().insert(userData);
                    // 返回
                    resData.code = 1; 
                    this.sendMsg(resData);
                    resolve(userData);
                }
                resolve(results[0]);
            })
        })
        return promise;
    }
}