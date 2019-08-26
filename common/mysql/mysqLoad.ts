import { UserDataTab } from "./tables/user";

export class MysqlLoad {
    protected static _mysqlLoad: MysqlLoad;
    public static getInstance(): MysqlLoad {
        if (!this._mysqlLoad) {
            this._mysqlLoad = new MysqlLoad();
        }
        return this._mysqlLoad;
    }

    public initMysqlTablb() {
        UserDataTab.getInstance().create();
    }
}