import { Channel } from '../common/socket/channel';
import { MysqlClass } from '../common/mysql/mysql';
import { TableLoad } from '../common/parseTables/tableLoad';
import { MysqlLoad } from '../common/mysql/mysqLoad';
import { UserMainLogic } from './handler/userMainLogic';
import { SocketSvr } from '../common/socket/socketSrv';
import { MessageInit } from '../protocol/message/messageInit';

class GameSvr {

    public initSvr() {

        process.on('uncaughtException', (err: Error) => {
            console.log('Caught exception: ' + err);
        });

        // mysql init
        MysqlClass.getInstance().initDB();
        MysqlLoad.getInstance().initMysqlTablb();

        // tables init
        TableLoad.getInstance().initTable();

        // message init
        MessageInit.getInstance().init();

        // server init
        let socketSrv = new SocketSvr();
        socketSrv.initSvr((channel: Channel) => {
            let mainLogic: UserMainLogic = new UserMainLogic();
            mainLogic.setChannel(channel);
        });
    }
}

let gameSvr: GameSvr = new GameSvr();
gameSvr.initSvr();
