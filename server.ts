import { Channel } from './socket/channel';
import { MysqlClass } from './mysql/mysql';
import { TableLoad } from './parseTables/tableLoad';
import { proto_login } from './protocol/message/proto_login';
import { MysqlLoad } from './mysql/mysqLoad';
import { MainLogic } from './handler/main/mainLogic';
import { SocketSvr } from './socket/socketSrv';

class Svr {

    public initSvr() {
        // mysql init
        MysqlClass.getInstance().initDB();
        MysqlLoad.getInstance().initMysqlTablb();

        // tables init
        TableLoad.getInstance().initTable();

        // message init
        proto_login.MessageInit.getInstance().init();

        let socketSrv = new SocketSvr()
        socketSrv.initSvr((channel: Channel) => {
            let mainLogic: MainLogic = new MainLogic();
            mainLogic.setChannel(channel);
        });
    }
}

let svr: Svr = new Svr();
svr.initSvr();
