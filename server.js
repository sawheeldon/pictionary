var http = require('http');
var express = require('express');
var socket_io = require('socket.io');
var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
//var $ = require("jquery");

// var jsdom = require("jsdom");

// jsdom.env(
//   "https://iojs.org/dist/",
//   ["http://code.jquery.com/jquery.js"],
//   function (err, window) {
//     console.log("there have been", window.$("a").length - 4, "io.js releases!");
//   }
// );



io.on('connection', function (socket) {
    
    //logs the new client connected message
    console.log('New client connected');

    socket.on('draw', function(position) {
        console.log('Received drawing', position);
        socket.broadcast.emit('draw',position);
    });
    
    socket.on('clearCanvas', function () {
        io.emit('clearCanvas');
   });
    
    socket.on('guess',function(guess) {
        console.log('User guessed',guess);
        socket.broadcast.emit('guess',guess);
    });

    socket.on('disconnect', function() {
        console.log('A user has disconnected');
    });

});
server.listen(process.env.PORT || 8080);