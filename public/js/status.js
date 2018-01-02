var socket = io();
socket.on('updateLocation', function (msg) {
    getLocation();
});