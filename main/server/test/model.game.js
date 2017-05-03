import initYog from './init.js';
initYog();
import {
    expect
} from 'chai';
import Game from '../model/game';
import getKnex from '../utils/db/knex.js';
let knex = getKnex();
let roomId = 'room' + new Date().getTime();
let pattern = {
    villager: 1,
    werewolf: 1
};
let userList = [1, 2];
let game = new Game(pattern, userList, roomId);

describe('GAME', function() {
    before(function(done) {
        game.setup().then(() => {
            done()
        });
    });
    it('游戏房间id不存在时，抛出TypeError', function() {
        try {
            new Game({}, [1]);
        } catch (e) {
            expect(e.name).to.equal('TypeError');
        }
    });
    it('游戏人数不准确时，抛出异常', function() {
        try {
            new Game({}, [1], 'iamroomid');
        } catch (e) {
            expect(e.message).to.contain('1:游戏人数错误');
        }
    });
    describe('游戏初始化数据', function() {
        it('baseinfo数据插入', async function() {
            let gameId = (await knex('dim_game_baseinfo').first('id').where('room_id', roomId)).id;
            expect(gameId).to.equal(game.gameId);
        });
        it('game_role数据插入', async function() {
            let userIds = (await knex('dim_game_role').select('user_id').where('game_id', game.gameId))
                .map(item => item.user_id);
            expect(userIds).to.have.lengthOf(userList.length);
            expect(userIds).to.include(userList[0]);
        });
    });
    it('游戏开始，返回每个用户的角色', async function() {
        let gameuserList = await game.begin();
        let gameinfo = await knex('dim_game_baseinfo').select('id').where({
            id: game.gameId,
            status: 2
        });
        expect(gameuserList).to.have.lengthOf(userList.length);
        expect(gameuserList.filter(item => item.role === 'villager')).to.have.lengthOf(~~pattern.villager);
        expect(gameuserList.filter(item => item.role === 'werewolf')).to.have.lengthOf(~~pattern.werewolf);
        expect(gameuserList.filter(item => item.role === 'seer')).to.have.lengthOf(~~pattern.seer);
        expect(gameuserList.map(item => item.userId)).to.contain(userList[0])
            .to.contain(userList[1]);
        expect(gameuserList).to.have.deep.property('[0].action', 'role');
    })
});
