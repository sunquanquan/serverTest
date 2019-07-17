import * as http from 'http';
import { server, request, connection } from 'websocket';
import { Channel } from './socket/channel';
import { MysqlClass } from './mysql/mysql';
import { TableBase } from './parseTables/tableBase';
import { TableLoad } from './parseTables/tableLoad';

class Svr {

    public initSvr() {
        // mysql init
        MysqlClass.getInstance().initDB();

        // tables init
        TableLoad.getInstance().initTable();

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