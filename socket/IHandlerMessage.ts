import { IMessage } from "websocket";

export interface IHandlerMessage {
    handlerMessage(msg: IMessage): void;
    handlerClose(code: number, desc: string): void;
}