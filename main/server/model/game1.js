import * as uuidV1 from "uuid/v1";

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
        this.isFirstDay = true;
        this.room = uuidV1(); // @param {string} 房间id
        this.userList = {}; // @param {Array} 加入游戏的用户列表 [{userId: '123', role:'langr', alive: true, socketId: 'abc'}]
        this.langrKillList = []; // @param {string} 狼人杀人列表 [{from: '123', target: '456'},]
        this.roles = this.arrangeRole(pattern);
        this.totalGamer = this.roles.length;
        this.users = {};
    }
    arrangeRole(pattern) {
        let role = [];
        while (pattern.pm--) {
            role.push('pm');
        }
        while (pattern.langr--) {
            role.push('langr');
        }
        while (pattern.yy--) {
            role.push('yy');
        }
        while (pattern.nw--) {
            role.push('nw');
        }
        while (pattern.lier--) {
            role.push('lier');
        }
        while (pattern.sw--) {
            role.push('sw');
        }
        // 打散牌型
        for (let i = role.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [role[i - 1], role[j]] = [role[j], role[i - 1]];
        }
        return role;
    }
    addUser(userId, socket) {
        socket.join(this.room);
        Object.assign(this.users, {
            [userId]: {
                socketId: socket.id,
                alive: true
            }
        });
        if (Object.keys(this.users).length === this.totalGamer) {
            let me = this;
            // 未每一个用户添加角色
            Object.keys(this.users).map((v, i) => {
                me.users[v].role = me.roles[i];
            });
            this.userList = Object.keys(this.users).map(v => {
                return Object.assign(this.users[v], {
                    userId: v
                });
            });
            this.langrList = me.userList.filter(item => item.role === 'langr').map(item => item.userId);
            this.beginGame();
            yog.log.notice(`游戏开始了`);
        }
    }
    beginGame() {
        this.isNight = true;
        this.attachEvent();
    }
    attachEvent() {}
    set isNight(v) {
        yog.io.of('/').in(this.room).emit('night');
        if (this.isFirstDay) {
            this.isFirstDay = false;
            for (let id of Object.keys(this.users)) {
                yog.io.of('/').in(this.users[id].socketId).emit('role', this.users[id].role);
            }
        }
        this.langrenStatus = 'killing';
        this.yuyanjiaStatus = 'checking';
        this.shouweiStatus = 'defending';
    }
    set isDaytime(v) {}
    set langrenStatus(v) {
        switch (v) {
            case 'killing':
                for (let user of this.userList) {
                    if (user.role === 'langr' && user.alive) {
                        // 向狼人发送杀人命令
                        yog.io.of('/').in(user.socketId).emit('kill', {
                            langrList: this.langrList,
                            target: this.userList.filter(item => item.alive).map(item => item.userId)
                        });
                        // 接收狼人的杀人结果
                        yog.io.of('/').connected[user.socketId].on('kill', a => {
                            console.log('testtest');
                            console.log(a);
                        });
                        yog.io.of('/').connected[user.socketId].on('kill', a => {
                            console.log('testtest1');
                            console.log(a);
                        });
                    }
                }
                break;
            case 'finish':
                console.log('狼人杀人结束');
                this.nvwuStatus = 'poisoning';
                break;
        }
    }
    set yuyanjiaStatus(v) {
        switch (v) {
            case 'checking':
                console.log('预言家验人中');
                break;
            case 'finish':
                console.log('预言家验人结束');
                break;
        }
    }
    set shouweiStatus(v) {
        switch (v) {
            case 'defending':
                console.log('守卫守人中');
                break;
            case 'finish':
                console.log('守卫守人结束');
                break;
        }
    }
    set nvwuStatus(v) {
        switch (v) {
            case 'poisoning':
                console.log('女巫毒人中');
                break;
            case 'saving':
                console.log('女巫救人中');
                break;
            case 'finish':
                console.log('女巫操作结束');
                break;
        }
    }
}

export default Game;
