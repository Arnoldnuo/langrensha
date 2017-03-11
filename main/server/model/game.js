import * as uuidV1 from "uuid/v1";
import Pingmin from './role/pingmin';
import Langren from './role/langren';
import Lieren from './role/lieren';
import Yuyanjia from './role/yuyanjia';
import Nvwu from './role/nvwu';
import Shouwei from './role/shouwei';

const defaultPattern = {
    pm: 4,
    langr: 4,
    yy: 1,
    nw: 1,
    lier: 1,
    sw: 1
};

class Game {
    /**
     * 构造函数，构造函数的牌型
     * @param {Object} pattern 游戏的牌型
     * @param {Object} pattern.pm 平民数量
     * @param {number} pattern.lr 狼人数量
     * @param {number} pattern.yy 预言家数量
     * @param {number} pattern.nw 女巫数量
     * @param {number} pattern.lr 猎人数量
     * @param {number} pattern.sw 守卫数量
     **/
    constructor(pattern = defaultPattern) {
        this.room = uuidV1();
        this.role = this.arrangeRole(pattern);
        this.totalGamer = this.role.length;
        this.users = {};
    }
    arrangeRole(pattern) {
        let role = [];
        while (pattern.pm--) {
            role.push(new Pingmin());
        }
        while (pattern.langr--) {
            role.push(new Langren());
        }
        while (pattern.yy--) {
            role.push(new Yuyanjia());
        }
        while (pattern.nw--) {
            role.push(new Nvwu());
        }
        while (pattern.lier--) {
            role.push(new Lieren());
        }
        while (pattern.sw--) {
            role.push(new Shouwei());
        }
        return role;
    }

    /**
     * 在待开局的游戏中添加游戏玩家
     * @param {string} userId 用户的id
     * @param {string} socketId socket通道的用户id
     **/
    addUser(userId, socket) {
        Object.assign(this.users, {
            [userId]: socket.id
        });
        socket.join(this.room);
        if (Object.keys(this.users).length === this.totalGamer) {
            this.beginGame();
        }
        this.beginGame();
        console.log(userId, '加入了游戏');
    }
    /**
     * 开始游戏
     **/
    beginGame() {
        yog.io.of('/').in(this.room).emit('night');
    }
}

export default Game;
