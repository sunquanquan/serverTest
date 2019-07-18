import * as http from 'http';
import { server, request, connection } from 'websocket';
import { Channel } from './socket/channel';
import { MysqlClass } from './mysql/mysql';
import { TableBase } from './parseTables/tableBase';
import { TableLoad } from './parseTables/tableLoad';
import { proto_login } from './protocol/message/proto_login';

class Svr {

    public initSvr() {
        // mysql init
        MysqlClass.getInstance().initDB();

        // tables init
        TableLoad.getInstance().initTable();

        // message init
        proto_login.MessageInit.getInstance().init();

        // websocket server init
        let httpServer = http.createServer().listen(3000, () => {
            console.log((new Date()) + ' Server is listening on port 3000');
        })
        let wsServer = new server({
            httpServer: httpServer,
            autoAcceptConnections: false
        });
        wsServer.on("request", (request: request) => {
            if (!this.originIsAllow) {
                return;
            }
            let connection: connection = request.accept('echo-protocol', request.origin);
            Channel.getInstance().initConn(connection);
        })
    }
    public originIsAllow(origin: any) {
        return true;
    }
}

let svr: Svr = new Svr();
svr.initSvr();

// class Test {
//     a: number = 11;
// }

// let arr: any = [Test];

// let obj: any = {};

// for (let test of arr) {
//     if (!test["aa"]) {
//         test["aa"] = 1;
//         obj[1] = test;
//     }
// }
// console.log(arr);
// console.log(new obj[1]());
// console.log(obj[1]["aa"]);

// let test: any = new Test();
// console.log(test["__proto__"]["constructor"]["aa"]);

// let test = new Test();
// console.log(test);
// let testStr = JSON.stringify(test);
// let length = testStr.length;
// console.log(length);
// let testBuffer = Buffer.alloc(length + 5, testStr, 'utf8');
// console.log(testBuffer);
// console.log(testBuffer.length);
// testBuffer.writeUInt32LE(100000,length);
// console.log(testBuffer);
// console.log(testBuffer.readInt32LE(length));
// let aa = testBuffer.slice(0,length);
// console.log(JSON.parse(aa.toString()) as Test);
