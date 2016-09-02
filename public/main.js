var socket = io();

var incognitoMode = false;

var pictionary = function() {
    
    var canvas, context, drawing, guessBox, word, me;
    
    var WORDS = [];
    console.log(WORDS);
    
      //Choosing word for drawer
    var wordPicker = function(wordList) {
    return wordList[Math.floor(Math.random()*(wordList.length-1))];
    };
    
    //Displaying word to draw
    var setWord = function(word) {
            $('#word').text('You are the drawer! Your word is: ' + word).show();
            $('#guess').hide();
    };

    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };

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
    
    //Guesses
    // Show guess history
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
            user: 'Me',
            guess: guess
        });
        socket.emit('guess', guess);
        guessBox.val('');
    });


        socket.on('guess', addGuess);    
        socket.on('draw', draw);
            
    
};

$(document).ready(function() {
    pictionary();
});