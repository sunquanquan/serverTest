import ORM, { IField } from "../mysql/ORM";

// 只需要继承ORM类即可
export default class User extends ORM {
    public id: string = "user_id";
    public nickname: string = "user_nickname";
    public password: string = "user_password";
    public createTime: string = "user_create_time";
    public primaryKey: string = `PRIMARY KEY(${this.id})`;

    // 创建表的字段映射
    public createTableFieldMap: IField = {
        id: `${this.id} varchar(255) not null,`,
        nickname: `${this.nickname} varchar(50) not null,`,
        password: `${this.password} varchar(50) not null,`,
        createTime: `${this.createTime} varchar(50) not null,`,
        primaryKey: `${this.primaryKey}`
    }

    // 类属性与数据库列字段的映射 
    public fieldMap: IField = {
        id: this.id,
        nickname: this.nickname,
        password: this.password,
        createTime: this.createTime
    };
    // 默认值
    public defaultValue: IField = {
        id: "",
        nickname: "",
        password: "",
        createTime: Date.now().toString()
    }; 
    // 指定数据库表名
    public table: string = "user";

    // 表字段名
    public map: IField = Object.keys(this.fieldMap).reduce((acc: any, curKey: string) => {
        acc[this.fieldMap[curKey]] = curKey;
        return acc;
    }, {});
}


