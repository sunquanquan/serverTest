import { IError, IField } from "./orm";
import { QueryOptions, createPool, escape, format } from "mysql";

export interface ISqlResults {
    results: Array<IField>;
    fields: Object;
}
export interface IQueryObject {
    [name: string]: string | number;
}

export interface ISqlRes {
    err: IError;
    res?: ISqlResults;
}


export class MysqlClass {
    protected static _mysql: MysqlClass;
    public static getInstance(): MysqlClass {
        if (!this._mysql) {
            this._mysql = new MysqlClass();
        }
        return this._mysql;
    }

    private timeout: number = 4000;

    public initDB() {

    }

    public sqlQuery(sql: QueryOptions, callback: any) {
        let resErr = <IError>{
            err: false
        };
        const pool = createPool({
            host: "localhost",
            user: "root",
            password: "123456",
            port: 3306,
            database: "test",
        });

        pool.getConnection((err: any, conn: any) => {
            if (err) {
                callback(err, null, null);
            } else {
                conn.query(sql, (err: any, vals: any, fields: any) => {
                    //释放连接
                    conn.release();
                    //事件驱动回调
                    callback(err, vals, fields);
                });
            }
        });
    }

    public and(dataObject: IQueryObject): string {
        let queryString = "";
        Object.keys(dataObject).forEach(key => {
            queryString += escape(key) + "=" + dataObject[key] + " and "
        });
        return queryString.replace(/\sand\s$/, "");
    }

    public tableQuery(table: string, condition: IQueryObject | string, callback: any) {
        this.sqlQuery({
            sql: typeof condition === "string" ?
                format("select * from ?? where ??", [table, condition]) :
                format("select * from ?? where ?", [table, condition]),
            timeout: this.timeout
        }, (err: any, results: any, fields: any) => {
            callback(err, results, fields);
        })
    }

    public insertTable(table: string, data: IQueryObject | Array<string | number>, callback: any) {
        let sqlStr = Array.isArray(data) ?
            format("insert into ?? values(??)", [table, (<Array<string | number>>data).join(", ")]) :
            format("insert into ?? set ?", [table, data]);
        this.sqlQuery({
            sql: sqlStr,
            timeout: this.timeout
        }, (err: any, results: any, fields: any) => {
            callback(err, results, fields);
        });
    }

    public updateTable(table: string, update: IQueryObject, condition: IQueryObject | string, callback: any) {
        this.sqlQuery({
            sql: typeof condition === "string" ?
                format("update ?? set ? where ??", [table, update, condition]) :
                format("update ?? set ? where ?", [table, update, condition]),
            timeout: this.timeout
        }, (err: any, results: any, fields: any) => {
            callback(err, results, fields);
        })
    }

    public deleteRow(table: string, condition: IQueryObject | string, callback: any) {
        this.sqlQuery({
            sql: typeof condition === "string" ?
                format("delete from ?? where ??", [table, condition]) :
                format("delete from ?? where ?", [table, condition]),
            timeout: this.timeout
        }, (err: any, results: any, fields: any) => {
            callback(err, results, fields);
        })
    }
}
