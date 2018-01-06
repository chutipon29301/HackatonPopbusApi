"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request-promise-native');
var schedule = require('node-schedule');
var exec = require('child_process').exec;
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
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Client-ID, Client-Secret');
    next();
});

app.use(express.static('public'));

app.set('view engine', 'pug');

var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(3000, function () {
    console.log('listening on port 3000');
    writeLog('Server started')
});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

app.get('/', function (req, res) {
    res.render('thinc', {});
});

app.get('/home', function (req, res) {
    res.render('home', {});
});

app.get('/thincexplorer', (req, res) => {
    res.render('explorer', {});
});

app.get('/ref', (req, res) => {
    res.sendFile(__dirname + '/thincexplorer.html');
});

app.get('/token', (req, res) => {
    res.sendFile(__dirname + '/token.html');
});

app.get('/countdown', (req, res) => {
    res.sendFile(__dirname + '/countdown.html');
});

app.post('/get/temp/inside', validateRequestToken, (req, res) => {
    let busid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    let index = busid.indexOf(parseInt(req.body.busid));
    if (index != -1) {
        res.json({
            status: 1,
            data: temp.getInsideTemp(busPosition.getCurrentWeight()[index].currentWeight - 7000)
        });
    } else {
        res.json({
            status: 0,
            error: "Bus not found"
        });
    }
});

app.post('/get/temp/inside/all', validateRequestToken, (req, res) => {
    let data = [];
    busPosition.getCurrentWeight().forEach(weight => {
        data.push(temp.getInsideTemp(weight.currentWeight - 7000));
    });
    res.json({
        status: 1,
        data: data
    });
});

app.post('/get/temp/outside', validateRequestToken, (req, res) => {
    res.json({
        status: 1,
        data: temp.getOutsideTemp()
    })
    // TODO Alternate between different cars
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
            error: "Bus route not found"
        })
    }
});

app.post('/get/position', validateRequestToken, function (req, res) {
    res.json({
        status: 1,
        data: busPosition.getCurrentPosition()
    });
});

app.post('/get/weight', validateRequestToken, function (req, res) {
    res.json({
        status: 1,
        data: busPosition.getCurrentWeight()
    });
});

app.get('/status', function (req, res) {
    res.status(200).render('status', {
        locations: busPosition.getCurrentPosition()
    });
});

app.post('/get/token', function (req, res) {
    setTimeout(() => {
        let token = tokenManager.getTokenByPhone(req.body.phone);
        if (token) {
            res.json({
                status: 1,
                client_id: token.public,
                client_secret: token.private
            })
        }
        else {
            res.json({
                status: 0,
                error: 'Unexpected format'
            })
        }
    }, 2500 + 1000 * Math.random());
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
        let token = tokenManager.getToken(publicKey);
        res.set('X-Request-Limit', token.limit);
        res.set('X-Request-Remaining', remaining);
        let date = new Date();
        writeLog(token.name + ' request ' + req.url);
        return next();
    }
}
function writeLog(message) {
    let date = new Date();
    exec('echo "' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0') + ' ' + message + '" >> log/' + date.getFullYear() + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0') + '.txt');
}
