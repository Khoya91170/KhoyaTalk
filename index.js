/* Created by fouzi on 07/11/2015. */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var trim = require('trim');
var striptags = require("striptags");
var numberOfConnectedUser = 0;


app.use('/public', express.static(__dirname + '/public')); // It will find static files like css, js files
//app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
})


// When client is connected to the chat (so on the socket) :
io.on('connection', function (socket) {
    console.log('a user connected');
    console.log('socket = ');
    console.log(socket.id);

    socket.username = 'Unknown';

    socket.on('disconnect', function () {
        if(numberOfConnectedUser > 0)
            numberOfConnectedUser--;
        console.log('user disconnected');
        socket.broadcast.emit('numberOfUser has changed', numberOfConnectedUser);
    });

    socket.on('chat username', function (data) {
        socket.username = striptags(data);
    });

    socket.on('chat message', function (msg) {
        if (trim(msg) != '') {
            io.emit('chat message', this.username + ": " + msg);
        }
    });

    socket.on('chat connection', function(data){
        /*console.log('LOUUUUUUUUUU BOYYYYYYYYYYYY');
        console.log("STRIPTAG" + striptags(data));*/
        numberOfConnectedUser++;
        socket.username = striptags(data);

        // When someone is connected to the chat we send back the username of the new user and the number of connected user
        var dataToSend =
        {
            "nameUser" : socket.username,
            "numberOfUserConnected" : numberOfConnectedUser
        };

        socket.emit('connection success', dataToSend);

        // A modifier
        //socket.broadcast.emit('user is connected', data + " vient de se connecter");
        console.log("Nombre d'user connecté : " + numberOfConnectedUser);
        socket.broadcast.emit('numberOfUser has changed', numberOfConnectedUser);
    });
});

http.listen(3025, function () {
    console.log('listening on 3000');
});