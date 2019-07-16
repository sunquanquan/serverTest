import { IField, ORM } from "../mysql/ORM";

// 数据类
export class UserData {
    public id: string = "";
    public nickname: string = "";
    public age: number = 0;
    public password: string = "";
    public createTime: string = "";
}

// 只需要继承ORM类即可
export class UserDataTab extends ORM {
    // 字段名
    public id: string = "user_id";
    public nickname: string = "user_nickname";
    public age: string = "user_age";
    public password: string = "user_password";
    public createTime: string = "user_create_time";
    public primaryKey: string = `PRIMARY KEY(${this.id})`;

    // 字段定义
    public createTableFieldMap: IField = {
        id: `${this.id} varchar(255) not null,`,
        nickname: `${this.nickname} varchar(50) not null,`,
        age: `${this.age} int not null,`,
        password: `${this.password} varchar(50) not null,`,
        createTime: `${this.createTime} varchar(50) not null,`,
        primaryKey: `${this.primaryKey}`
    }

    // 类属性与数据库列字段的映射 
    public fieldMap: IField = {
        id: this.id,
        nickname: this.nickname,
        age: this.age,
        password: this.password,
        createTime: this.createTime
    };
   
    // 指定数据库表名
    public table: string = "user";

    // 表字段名
    public map: IField = Object.keys(this.fieldMap).reduce((acc: any, curKey: string) => {
        acc[this.fieldMap[curKey]] = curKey;
        return acc;
    }, {});
}


