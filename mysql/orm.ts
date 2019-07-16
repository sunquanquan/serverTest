import { MysqlClass } from "./mysql";
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
    fetchAll(condition: IField | string, cb: any): void;
    fetch(query: IField | string, cb: any): void;
    insert(data: IField, cb: any): void;
    update(data: IField, condition: IField | string, cb: any): void;
    delete(condition: IField | string, cb: any): void;
}
// ORM framework
export class ORM implements IORM {
    public createTableFieldMap!: IField;
    public fieldMap!: IField;
    public map!: IField;
    public table!: string;
    public defaultValue!: IField;

    public delete(condition: IField | string, callback: any) {
        const dbCondition: IField | string = typeof condition === "string" ? condition : this.getFieldObject(condition);
        MysqlClass.getInstance().deleteRow(this.table, dbCondition, (err: any, results: any, fields: any) => {
            callback(err, results, fields);
        });
    }
    public fetch(query: IField | string, callback: any) {
        const dbQuery: IField | string = typeof query === "string" ? query : this.getFieldObject(query);
        MysqlClass.getInstance().tableQuery(this.table, dbQuery, (err: any, results: any, fields: any) => {
            callback(err, results, fields);
        });
    }

    public fetchAll(callback: any, condition?: IField | string) {
        MysqlClass.getInstance().sqlQuery({
            sql: !condition ? format("select * from ??", [this.table]) :
                typeof condition === "string" ?
                    format("select * from ?? where ??", [this.table, condition]) :
                    format("select * from ?? where ?", [this.table, condition]),
            timeout: 2000
        }, (err: any, results: any, fields: any) => {
            callback(err, results, fields);
        });
    }

    public create(callback: any) {
        let sqlStr: string = "";
        for (let key in this.createTableFieldMap) {
            sqlStr += this.createTableFieldMap[key];
        }
        const createTableSql: string = `CREATE TABLE ${this.table} (${sqlStr}) ENGINE=InnoDB DEFAULT CHARSET=utf8`;
        MysqlClass.getInstance().sqlQuery({
            sql: createTableSql,
            timeout: 2000
        }, (err: Error, result: any, field: any) => {
            callback(err, result, field);
        });
    }

    public insert(data: IField, callback: any) {
        const dbData: IField = this.getFieldObject(data);
        MysqlClass.getInstance().insertTable(this.table, dbData, (err: any, results: any, fields: any) => {
            callback(err, results, fields);
        });
    }
    public update(data: IField, condition: IField | string, callback: any) {
        const dbData: IField = this.getFieldObject(data);
        const dbCondition: IField | string = typeof condition === "string" ? condition : this.getFieldObject(condition);
        MysqlClass.getInstance().updateTable(this.table, dbData, dbCondition, (err: any, results: any, fields: any) => {
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
