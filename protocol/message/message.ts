export namespace message {
    // 协议
    export class LoginC2S {
        public username: string = "";
        public password: string = "";
        public ipAddress?: string;
    }
    export class LoginS2C {
        public code: number = 0;

        // 清除数据
        public clear() {
            this.code = 0;
        }
        // 复制数据
        public copyData(obj: LoginS2C) {
            this.code = obj.code;
        }
    }
    export class TestC2S {
        public username: string = "";
    }
}