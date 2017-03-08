import * as http from 'http';
import * as socketIo from 'socket.io';
yog.io.on('connection', function(socket) {
    console.log(socket.request.headers.cookie);
    socket.on('enterRoom', (a) => {
        socket.broadcast.emit('bro', a);
    });
});

module.exports = function(req, res) {
    res.render('main/page/index.tpl');
};
