var express = require('express');
var bodyParser = require('body-parser');
var request = require('request-promise-native');
var temp = require('./calculator');
var busPosition = require('./route');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.static('public'));

app.set('view engine', 'pug');

var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(3000, function () {
    console.log('listening on port 3000');
});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

app.get('/', function (req, res) {
    res.render('home', {});
});

app.get('/home', function (req, res) {
    res.render('home', {});
});

app.get('/getTemp', function (req, res) {
    res.status(200).send(temp());
});

app.get('/getPos', function (req, res) {
    res.status(200).send(busPosition.calculateSpeed());
});