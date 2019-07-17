export namespace proto_login {
    export class MessageInit {

        constructor(){
        }

        protected _message: any = {};

        protected static _messageInit: MessageInit;

        public static getInstance(): MessageInit {
            if(!this._messageInit) {
                this._messageInit = new MessageInit();
            }
            return this._messageInit;
        }

        public init() {
            const messageArr: any = [LoginC2S, TestC2S];
            let commandKey: string = "command";
            let command: number = 0;
            for(let messageTemp of messageArr) {
                command++;
                if(!messageTemp[commandKey]){
                    messageTemp[commandKey] = command;
                    this._message[command] = messageTemp;
                }
            }
        }
    }


    // 协议
    export class LoginC2S {
        username: string = "";
        password: string = "";
        ipAddress?: string;
    }
    export class TestC2S {
        username: string = "";
    }
}