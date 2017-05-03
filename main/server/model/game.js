import getKnex from '../utils/db/knex.js';
import * as moment from 'moment';
let knex = getKnex();
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
     * @param {Object} pattern.villager 平民数量
     * @param {number} pattern.werewolf 狼人数量
     * @param {number} pattern.seer 预言家数量
     * @param {number} pattern.witch 女巫数量
     * @param {number} pattern.hunter 猎人数量
     * @param {number} pattern.guard 守卫数量
     * @param {Array} item 此场游戏的用户id列表
     * @param {string} roomId 游戏的房间id
     **/
    constructor(pattern = defaultPattern, userList = [], roomId) {
        if (!roomId) {
            throw new TypeError('roomId不存在');
        }
        let {
            villager = 0, werewolf = 0, seer = 0, witch = 0, hunter = 0, guard = 0
        } = pattern;
        let totalGamer = villager + werewolf + seer + witch + hunter + guard;
        if (totalGamer !== userList.length) {
            throw new Error(`1:游戏人数错误，共${totalGamer}个角色，${userList.length}个玩家`);
        }
        this.roomId = roomId;
        this.pattern = pattern;
        // 用户列表进行乱序排列
        userList = userList.sort(() => {
            return Math.random() > 0.5
        });
        let userDbList = [];
        while (villager--) {
            userDbList.push({
                role: 'villager',
                has_poison: 0,
                has_antidote: 0,
                last_guard: 0
            });
        }
        while (werewolf--) {
            userDbList.push({
                role: 'werewolf',
                has_poison: 0,
                has_antidote: 0,
                last_guard: 0
            });
        }
        while (seer--) {
            userDbList.push({
                role: 'seer',
                has_poison: 0,
                has_antidote: 0,
                last_guard: 0
            });
        }
        while (guard--) {
            userDbList.push({
                role: 'guard',
                has_poison: 0,
                has_antidote: 0,
                last_guard: 0
            });
        }
        while (witch--) {
            userDbList.push({
                role: 'witch',
                has_poison: 1,
                has_antidote: 1,
                last_guard: 0
            });
        }
        while (hunter--) {
            userDbList.push({
                role: 'hunter',
                has_poison: 0,
                has_antidote: 0,
                last_guard: 0
            });
        }
        userDbList.forEach((item, index) => {
            item.user_id = userList[index];
            item.game_id = this.gameId;
            item.alive = 1;
            item.create_time = moment().unix();
        });
        this.userDbList = userDbList;
    }
    async setup() {
        let {
            villager = 0, werewolf = 0, seer = 0, witch = 0, hunter = 0, guard = 0
        } = this.pattern;
        await knex.transaction(async(ctx) => {
            this.gameId = (await ctx.insert({
                room_id: this.roomId,
                villager_count: villager,
                werewolf_count: werewolf,
                seer_count: seer,
                witch_count: witch,
                hunter_count: hunter,
                guard_count: guard,
                create_time: moment().unix(),
                status: 1
            }).into('dim_game_baseinfo'))[0];
            this.userDbList.forEach((item) => {
                item.game_id = this.gameId;
            });
            await ctx.batchInsert('dim_game_role', this.userDbList);
        });
    }
    async begin() {
        let userList = [];
        await knex.transaction(async(ctx) => {
            await knex('dim_game_baseinfo').transacting(ctx)
                .update({
                    status: 2,
                    game_day: 1
                }).where('id', this.gameId);
            userList = await knex('dim_game_role').transacting(ctx)
                .select('role', 'user_id as userId')
                .where('game_id', this.gameId);
            userList.forEach(item => {
                item.action = 'role';
            });
        });
        return userList;
    }
    async next() {
        let users = await knex('dim_game_role').select('')
    }
}

export default Game;
