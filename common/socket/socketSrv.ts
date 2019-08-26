import * as http from 'http';
import { GameSrvConfig } from '../../config/gameConfig';
import { server, request, connection } from 'websocket';
import { Channel } from './channel';

export class SocketSvr {

    public initSvr(cb: any) {
        // websocket server init
        let httpServer = http.createServer().listen(GameSrvConfig.port, () => {
            console.log((new Date()) + ` Server is listening on port ${GameSrvConfig.port}`);
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
            let channel = new Channel();
            channel.initConn(connection);
            cb(channel);
        });
    }
    public originIsAllow(origin: any) {
        return true;
    }
}