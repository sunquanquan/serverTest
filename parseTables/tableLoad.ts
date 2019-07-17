import { TestTab } from "./testTab";

export class TableLoad {
    protected static _tableLoad: TableLoad;
    public static getInstance(): TableLoad {
        if (!this._tableLoad) {
            this._tableLoad = new TableLoad();
        }
        return this._tableLoad;
    }

    public initTable() {
        TestTab.getInstance().loadFile("test.json");
    }
}