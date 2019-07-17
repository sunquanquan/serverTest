const buftestpb = require('./protobuf/buftest_pb');

export class Proto {
    protected static _proto: Proto;
    public static getInstance(): Proto {
        if(!this._proto) {
            this._proto = new Proto();
        }
        return this._proto;
    }

    public getSerializeBinary(message: any) {
        return message.serializeBinary();
    }

    public getDeserializeBinary(bytes: any) {
        return buftestpb.SearchRequest.deserializeBinary(bytes);
    }
}

// console.log(buftestpb);
// for(let key in buftestpb) {
//     console.log("-------------");
//     console.log(key);
// }
const message = new buftestpb.SearchRequest();
message.setName("TS");
message.setPassword("123456");
console.log(message);
const bytes = message.serializeBinary();
console.log(bytes);
const message2 = buftestpb.SearchRequest.deserializeBinary(bytes);
console.log(message2.toObject());
