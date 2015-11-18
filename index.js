/**
 * Created by fouzi on 07/11/2015.
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var trim = require('trim');

//var antiSpam = require('socket-anti-spam');
//var clients;

app.use('/public', express.static(__dirname + '/public')); // It will find static files like css, js files
//app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
})

// Prevent spam from user
/*
 var antiSpam = new antiSpam({
 spamCheckInterval: 3000,
 spamMinusPointsPerInterval: 3,
 spamMaxPointsBeforeKick: 9,
 spamEnableTempBan: true,
 spamKicksBeforeTempBan: 3,
 spamTempBanInMinutes: 10,
 removeKickCountAfter: 1,
 debug: false
 });*/


// When client is connect to the chat (so on the socket) :
io.on('connection', function (socket) {
    console.log('a user connected');
    console.log('socket = ');
    console.log(socket.id);

    socket.username = 'Unknown';

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('chat username', function (data) {
        socket.username = data;
    });

    socket.on('chat message', function (msg) {
        if (trim(msg) != '') {
            io.emit('chat message', this.username + " : " + msg);
        }
    });

    socket.on('chat connection', function(data){
       socket.username = data;
        socket.emit('connection success', data);
        socket.broadcast.emit('user is connected', data + " vient de se connecter");
    });
});

http.listen(3025, function () {
    console.log('listening on 3000');
});