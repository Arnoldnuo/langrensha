import getKnex from '../../utils/db/knex.js';
import * as moment from 'moment';
let knex = getKnex();
/**
 * 处理用户操作，返回下一步指令
 * @param {string} gameId 游戏id
 * @param {string} userId 用户id
 * @param {string} action 用户操作
 * @param {Object} extra 用户的操作的额外数据
 * @return {Array} 用户需要进行的操作
 * @return {String} [0].action 用户需要进行的操作
 * @return {String} [0].userId 用户的id
 * @return {Boolean} [0].all 是否给该游戏的全部用户发送，如果为true，则忽略userId的值
 **/
let process = async(gameId, userId, action, extra) => {
    // 游戏开始: 返回每个人的角色，和需要做的操作
    if (action === 'begin') {
        let users = await knex('dim_game_role').select('user_id as userId', 'role').where('game_id', gameId);
        // 发送role指令
        let actions = users.map(item => {
            item.action = 'role';
            return item;
        });
        // 发送night指令
        actions.push({
            all: true,
            action: 'night'
        });
        // 发送kill指令
        let werewolfIds = users.filter(item => {
            return item.role === 'werewolf';
        }).map(item => item.userId);
        let notWerewolfIds = users.filter(item => {
            return item.role !== 'werewolf';
        }).map(item => item.userId);
        werewolfIds.forEach((item) => {
            actions.push({
                userId: item,
                action: 'kill',
                werewolfList: werewolfIds,
                target: notWerewolfIds
            });
        });
        // 发送posion指令
        let witchIds = users.filter(item => {
            return item.role === 'witch';
        }).map(item => item.userId);
        witchIds.forEach(witchId => {
            let targetIds = users.filter(userId => userId !== witchId).map(item => item.userId);
            actions.push({
                userId: witchId,
                action: 'poison',
                target: targetIds
            });
        });
        // 发送defend命令
        let guardIds = users.filter(item => item.role === 'guard').map(item => item.userId);
        guardIds.forEach(guardId => {
            let targetIds = user.filter(userId => userId != guardId).map(item => item.userId);
            actions.push({
                userId: guardId,
                action: 'defend',
                target: targetIds
            });
        });
        // 发送check命令
        let seerIds = users.filter(item => item.role === 'seer').map(item => item.userId);
        seerIds.forEach(seerId => {
            let targetIds = user.filter(userId => userId != seerId).map(item => item.userId);
            actions.push({
                userId: seerId,
                action: 'check',
                target: targetIds
            });
        });
        return actions;
    }
};
