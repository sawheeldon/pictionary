var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

function addUser(username) {
    var user = {
        name: username,
        drawer:false,
        waiting: true
    };
  return user.id;
}  

io.on('connect', function(socket) {
    socket.on('draw', function(position) {
        socket.broadcast.emit('draw', position);
    });
    
    socket.on('addUser', function(username) {
    socket.emit= addUser(username);
    });
    
    socket.on('guess', function(addGuess){
        socket.broadcast.emit('guess', addGuess);
    });
    socket.on('clearCanvas', function (clear) {
        io.emit('clearCanvas');
   });
});



server.listen(process.env.PORT || 8080);