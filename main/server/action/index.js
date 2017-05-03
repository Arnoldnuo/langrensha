import * as uuidV1 from 'uuid/v1';
import * as cookie from 'cookie';
import Game from '../model/game';

let game = new Game({
    pm: 1,
    langr: 1,
    nw: 1,
    yy: 1
});

yog.io.on('connection', (socket) => {
    socket.on('join', () => {
        let userId = cookie.parse(socket.request.headers.cookie).userId;
        game.addUser(userId, socket);
    });
    socket.on('kill', (a) => {
        console.log(a, '----');
    })
});
module.exports = function(req, res) {
    // 本地写cookie，唯一标示一个用户
    let userId = req.cookies.userId;
    if (!userId) {
        userId = uuidV1();
        res.cookie('userId', userId, {
            expires: new Date(Date.now() + 315360000000),
            httpOnly: true
        });
    }
    res.render('main/page/index.tpl');
};
