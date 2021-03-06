import { message } from "./message";

export class MessageInit {
        
    protected _message: any = {};

    public readonly commandKey: string = "command";
    protected readonly extraBufferSize: number = 5;

    protected static _messageInit: MessageInit;

    public static getInstance(): MessageInit {
        if (!this._messageInit) {
            this._messageInit = new MessageInit();
        }
        return this._messageInit;
    }

    public init() {
        const messageArr = [];
        let messageTemp: any = message;
        for(let aa in messageTemp) {
            messageArr.push(messageTemp[aa]);
        }
        let command: number = 0;
        for (let messageTemp of messageArr) {
            command++;
            if (!messageTemp[this.commandKey]) {
                messageTemp[this.commandKey] = command;
                this._message[command] = messageTemp;
            }
        }
    }

    public getObjectId(message: any) {
        return message["__proto__"]["constructor"][this.commandKey];
    }

    public write(message: any) {
        let messageStr = JSON.stringify(message);
        let length = messageStr.length;
        let buffer = Buffer.alloc(length + this.extraBufferSize, messageStr, 'utf8');
        buffer.writeUInt32LE(this.getObjectId(message), length);
        return buffer;
    }

    public read(message: Buffer) {
        let messageLength = message.length - this.extraBufferSize;
        let messageId = message.readInt32LE(messageLength);
        let classTemp = this._message[messageId];
        let classCase = new classTemp();
        let messageTemp = message.slice(0, messageLength);
        let messageJSON = JSON.parse(messageTemp.toString());
        for(let key in messageJSON) {
            classCase[key] = messageJSON[key];
        }
        classCase[this.commandKey] = classTemp['name'];
        return classCase;
    }
}