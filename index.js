var express = require('express');
var bodyParser = require('body-parser');
var request = require('request-promise-native');
var schedule = require('node-schedule');
var temp = require('./calculator');
var busPosition = require('./route');
var constants = require('./constants');
var tokenManager = require('./token-manager');

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

app.get('/explorer', (req, res) => {
    res.sendFile(__dirname + '/explorer.html');
});

app.get('/test', function (req, res) {
    res.render('htmlTemplate', {});
});

app.post('/get/temp/inside', (req, res) => {
    res.json({
        status: 1,
        data: temp.getInsideTemp(1000)
    });
    // TODO Replace with real bus weight
});

app.post('/get/temp/outside', (req, res) => {
    res.json({
        status: 1,
        data: temp.getOutsideTemp()
    })
    // TODO Alter between different cars
});

app.post('/get/stations', (req, res) => {
    res.json({
        status: 1,
        data: constants.station
    });
});

app.post('/get/route', (req, res) => {
    let busnumbers = [1, 2, 3, 4];
    if (busnumbers.indexOf(parseInt(req.body.busnumber)) != -1) {
        res.json({
            status: 1,
            data: constants['routeCoordinates_' + req.body.busnumber]
        });
    } else {
        res.json({
            status: 0,
            error: "Bus not found"
        })
    }
});

app.post('/get/speed', function (req, res) {
    res.status(200).send(busPosition.calculateSpeed());
});

app.post('/get/position', function (req, res) {
    res.status(200).send(busPosition.getCurrentPosition());
});

var locationUpdater = schedule.scheduleJob('* * * * * *', function () {
    io.emit('updateLocation','');
});

// TODO Refresh token

function validateRequestToken(req, res, next) {
    let publicKey = req.query.public_key;
    let privateKey = req.query.private_key;
    if (!publicKey || !privateKey) {
        return res.json({
            status: 0,
            error: "Request token public key and private key required"
        });
    }
    if (!tokenManager.validate(publicKey, privateKey)) {
        return res.json({
            status: 0,
            error: "Invalid token"
        });
    }
    // TODO Decrease remaining request value
    // TODO Do nothing on 0 remaining request
    next();
};