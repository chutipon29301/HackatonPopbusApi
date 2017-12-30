var express = require('express');
var bodyParser = require('body-parser');
var request = require('request-promise-native');
var temp = require('./calculator');
var busPosition = require('./route');
var constants = require('./constants');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get('/test', function (req, res) {
    res.render('htmlTemplate', {});
});

app.get('/get/stations', (req, res) => {
    res.json({ status: 1, data: constants.station });
});

app.get('/get/route', (req, res) => {
    let busnumbers = [1, 2, 3, 4, 5, 6];
    if (busnumbers.indexOf(parseInt(req.query.busnumber)) != -1) {
        res.json({ status: 1, data: constants['routeCoordinates_' + req.query.busnumber] });
    }
    else {
        res.json({ status: 0, error: "Bus not found" })
    }
});

app.get('/get/temp', function (req, res) {
    res.status(200).send(temp());
});

app.get('/get/pos', function (req, res) {
    res.status(200).send(busPosition.calculateSpeed());
});