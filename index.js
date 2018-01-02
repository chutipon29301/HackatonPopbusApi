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

app.post('/get/temp/inside', validateRequestToken, (req, res) => {
    res.json({
        status: 1,
        data: temp.getInsideTemp(1000)
    });
    // TODO Replace with real bus weight
});

app.post('/get/temp/outside', validateRequestToken, (req, res) => {
    res.json({
        status: 1,
        data: temp.getOutsideTemp()
    })
    // TODO Alter between different cars
});

app.post('/get/stations', validateRequestToken, (req, res) => {
    res.json({
        status: 1,
        data: constants.station
    });
});

app.post('/get/route', validateRequestToken, (req, res) => {
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

app.post('/get/speed', validateRequestToken, function (req, res) {
    res.status(200).send(busPosition.calculateSpeed());
});

app.post('/get/position', validateRequestToken, function (req, res) {
    res.status(200).send(busPosition.getCurrentPosition());
});

app.get('/status', function (req, res) {
    res.status(200).render('status', {
        locations: busPosition.getCurrentPosition()
    });
});

var locationUpdater = schedule.scheduleJob('* * * * * *', function () {
    io.emit('updateLocation', busPosition.getCurrentPosition());
});

var tokenRefresher = schedule.scheduleJob('0 * * * * *', () => {
    tokenManager.refresh();
});

function validateRequestToken(req, res, next) {
    let publicKey = req.get('Client-ID');
    let privateKey = req.get('Client-Secret');
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
    let remaining = tokenManager.decrement(publicKey, privateKey);
    if (remaining >= 0) {
        res.set('X-Request-Limit', 60);
        res.set('X-Request-Remaining', remaining);
        return next();
    }
    setTimeout(() => {
        res.json({
            status: 0,
            error: "Request limit reached"
        });
    }, 5000);
};
