let socket = io('http://localhost:8085');
window.soc = socket;
socket.on('connect', () => {
    socket.emit('join');
    socket.on('night', (msg) => {
        console.log('晚上来了');
    });
    socket.on('role', (msg) => {
        console.log(`我的角色是${msg}`);
    });
    socket.on('kill', (msg) => {
        console.log('狼人列表是', msg.langrList.join(''));
        console.log('可杀人列表是', msg.target);
    })
});
