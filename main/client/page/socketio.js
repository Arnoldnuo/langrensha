let socket = io('http://localhost:8085');
window.soc = socket;
socket.on('connect', () => {
    socket.on('bro', (a) => {
        console.log(a);
    });
});
