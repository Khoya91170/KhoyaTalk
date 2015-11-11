/**
 * Created by fouzi on 07/11/2015.
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/public', express.static(__dirname + '/public')); // It will find static files like css, js files
//app.use(express.static(__dirname + '/public'));

// These two lines are required to retrieve data from POST method
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

var aUserName =""; // The username will be used in home.html (the chat)

app.get('/', function(req, res){ // function fire on load of the page (127.0.0.1:3000)
    res.sendFile(__dirname + '/index.html');
});

app.post('/index', urlencodedParser, function(req, res){  // function fire when post data is send to the uri 127.0.0.1:3000/index
    //console.log("jrentre ici");
    console.log(req.body);
    aUserName = req.body.username;
    if(aUserName)
        console.log("Un username catché !!!");
    if(aUserName && aUserName != '')
        res.sendFile(__dirname + '/home.html');
    else
        res.sendFile(__dirname + '/index.html');
});

// When client is connect to the chat (so on the socket) :
io.on('connection',function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg){
        if(msg != '')
        {
            io.emit('chat message', aUserName + " : " + msg);
        }
    });
});

http.listen(3000, function(){
   console.log('listening on 3000') ;
});