import { Channel } from '../common/socket/channel';
import { MysqlClass } from '../common/mysql/mysql';
import { TableLoad } from '../common/parseTables/tableLoad';
import { MysqlLoad } from '../common/mysql/mysqLoad';
import { MainLogic } from './handler/main/mainLogic';
import { SocketSvr } from '../common/socket/socketSrv';
import { MessageInit } from '../protocol/message/messageInit';

class Svr {

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
            let mainLogic: MainLogic = new MainLogic();
            mainLogic.setChannel(channel);
        });
    }
}

let svr: Svr = new Svr();
svr.initSvr();
