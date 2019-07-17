import { TableBase } from "./tableBase";

export class TestTab extends TableBase {
    protected static _testTab: TestTab;
    public static getInstance(): TestTab {
        if(!this._testTab) {
            this._testTab = new TestTab();
        }
        return this._testTab;
    }

    public testDataArr: any = [];

    public loadFile(fileName: string) {
        this.readFile(fileName);
        for(let data of this.fileData) {
            this.testDataArr.push(data);
        }
    }
}