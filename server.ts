import { Channel } from './socket/channel';
import { MysqlClass } from './mysql/mysql';
import { TableLoad } from './parseTables/tableLoad';
import { MysqlLoad } from './mysql/mysqLoad';
import { MainLogic } from './handler/main/mainLogic';
import { SocketSvr } from './socket/socketSrv';
import { MessageInit } from './protocol/message/messageInit';

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
