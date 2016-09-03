var socket = io();

var incognitoMode = false;

var pictionary = function() {
    
    var canvas, context, drawing, drawer, guessBox, me;
    
    var username = prompt('What\'s your name?') || 'Guest';
    
    
    //  var updateUsers = function(users) {
    //     $('#users').empty();
    //     users.forEach(function(user) {
    //         if (user.name != username) {
    //             addUser(user);
    //         } else {
    //             me = user;
    //         }
    //     });
    // };
    
        
    //Add users
    //*****Currently adding new user changes drawer waiting to true
    
      var addUser = function(user) {
        var isDrawer = 'notDrawing';
        if (user.drawer) {
            isDrawer = 'isDrawing';
        }
        $('#users').append('<div><button id="' + user.id + '" class="' + isDrawer + '">' + user.name + '</button></div>');
    };

    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };
    
      var clear = function() {
        context.clearRect(0, 0, canvas[0].width, canvas[0].height);
    };
    
     var addGuess = function(obj) {
        $('#guess').append('<div><strong><span class="highlight">' + obj.user + ':</span></strong> ' + obj.guess + '</div>');
    };
    
    //Capture guess input, return input

    guessBox = $('#guess input');
    guessBox.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }
        var guess = guessBox.val();
        addGuess({
            user: username,
            guess: guess
        });
        socket.emit('guess', guess);
        guessBox.val('');
    });


    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
     canvas.on('mousedown', function() {
        if (draw) {
            drawing = true;
        }
    });
    canvas.on('mouseup', function() {
        drawing = false;
    });
    canvas.on('mousemove', function(event) {
        var offset = canvas.offset();
        var position = {
            x: event.pageX - offset.left,
            y: event.pageY - offset.top
        };
        if (drawing) {
            if (!incognitoMode) {
                draw(position);
            }
            socket.emit('draw', position);
        }
    });
    
        $('#clear').on('click', function() {
            clear();
            socket.emit('clearCanvas');
        }); 


    socket.emit('addUser', username);
    socket.on('draw', draw);
    socket.on('guess', addGuess);
    socket.on('clearCanvas', clear);
};

$(document).ready(function() {
    pictionary();
});