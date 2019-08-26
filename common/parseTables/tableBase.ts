import * as fs from 'fs';

export class TableBase {
    public basePath: string = '\\config\\tables\\';
    public fileData: any;

    public readFile(fileName: string) {
        let path: string = __dirname;
        let pathArr: string[] = path.split('\\serverJS');
        let actPath = pathArr[0] + this.basePath + fileName;
        this.fileData = JSON.parse((fs.readFileSync(actPath)).toString());
    }
}