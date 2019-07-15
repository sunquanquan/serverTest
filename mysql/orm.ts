import { MysqlClass, ISqlRes } from "./mysql";
import { format } from "mysql";
export interface IField {
    [name: string]: string | number;
}
export interface IError {
    err: boolean;
    message?: string;
}
export interface IORM {
    fieldMap: IField;
    map: IField;
    table: string;
    defaultValue: IField;
    fetchAll(condition: IField | string): Promise<Array<IField> | IError>;
    fetch(query: IField | string): Promise<IField | IError>;
    insert(data: IField): Promise<IError>;
    update(data: IField, condition: IField | string): Promise<IError>;
    delete(condition: IField | string): Promise<IError>;
}
// ORM framework
export default class ORM extends MysqlClass implements IORM {
    public createTableFieldMap!: IField;
    public fieldMap!: IField;
    public map!: IField;
    public table!: string;
    public defaultValue!: IField;

    public delete(condition: IField | string, callback: any) {
        const dbCondition: IField | string = typeof condition === "string" ? condition : this.getFieldObject(condition);
        this.deleteRow(this.table, dbCondition, (err: any, results: any, fields: any) => {
            callback(err, results, fields);
        });
    }
    public fetch(query: IField | string) {
        const dbQuery: IField | string = typeof query === "string" ? query : this.getFieldObject(query);
        this.tableQuery(this.table, dbQuery, (err: any, results: any, fields: any) => {
            callback(err, results, fields);
        });
    }

    public fetchAll(condition?: IField | string, callback: any) {
        const res: ISqlRes = this.sqlQuery({
            sql: !condition ? format("select * from ??", [this.table]) :
                typeof condition === "string" ?
                    format("select * from ?? where ??", [this.table, condition]) :
                    format("select * from ?? where ?", [this.table, condition]),
            timeout: 2000
        }, (err: any, results: any, fields: any) => {
            callback(err, results, fields);
        });
    }

    public create() {
        let sqlStr: string = "";
        for(let key in this.createTableFieldMap) {
            sqlStr += this.createTableFieldMap[key];
        }
        const createTableSql: string = `CREATE TABLE ${this.table} (${sqlStr}) ENGINE=InnoDB DEFAULT CHARSET=utf8`;
        this.createTable(createTableSql, (err: Error, result: any, field: any) => {
            if(err) {
                console.log(err.message);
            }
            console.log(result);
            console.log(field);
        });
    }

    public insert(data: IField, callback: any) {
        const dbData: IField = this.getFieldObject(data);
        console.log("mysql...........");
        console.log(dbData);
        console.log(this.table);
        this.insertTable(this.table, dbData, (err: any, results: any, fields: any) => {
            callback(err, results, fields);
        });
    }
    public update(data: IField, condition: IField | string, callback: any) {
        const dbData: IField = this.getFieldObject(data);
        const dbCondition: IField | string = typeof condition === "string" ? condition : this.getFieldObject(condition);
        this.updateTable(this.table, dbData, dbCondition, (err: any, results: any, fields: any) => {
            callback(err, results, fields);
        });
    }

    public getFieldObject(data: IField): IField {
        return Object.keys(data).reduce((acc: any, curKey: string) => {
            acc[this.fieldMap[curKey]] = data[curKey];
            return acc;
        }, {});
    }
}
