import * as http from 'http';
import * as socketIo from 'socket.io';
yog.io.on('connection', function(socket) {
    console.log(socket);
});

module.exports = function(req, res) {
    res.render('main/page/index.tpl');
};
