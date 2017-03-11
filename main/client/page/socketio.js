let socket = io('http://localhost:8085');
window.soc = socket;
socket.on('connect', () => {
    socket.on('night', (a) => {
        console.log('晚上来了');
        console.log(a);
    });
});
