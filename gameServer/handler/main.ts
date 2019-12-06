import { UserMainLogic } from "./userMainLogic";
// 全局管理类
export class Main {
    private _userMainLogicMap: Map<string, UserMainLogic> = new Map();

    private static _main: Main;
    public static getInstance(): Main {
        if(!this._main) {
            this._main = new Main();
        }
        return this._main;
    }

    public pushUserMap(userMainLogic: UserMainLogic) {
        if(!this._userMainLogicMap.has(userMainLogic._uid)) {
            this._userMainLogicMap.set(userMainLogic._uid, userMainLogic);
        }
    }
}