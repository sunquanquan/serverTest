export namespace proto {
    // 协议
    export class LoginC2S {
        username: string = "";
        password: string = "";
        ipAddress?: string;
    }
    export class LoginS2C {
        code: number = 0;
    }
    export class TestC2S {
        username: string = "";
    }
}