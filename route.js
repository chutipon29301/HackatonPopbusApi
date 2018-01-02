var constants = require('./constants');
var schedule = require('node-schedule');
var math = require('mathjs');

const RAD = 0.000008998719243599958;

var bus_1 = {
    counter: 0,
    buses: [{
            id: 1,
            max_weight: 7000,
            latitude: constants.station[0].latitude,
            longitude: constants.station[0].longitude,
            current_position: 12,
            cumulative_distance: 0,
            atStop: false
        },
        {
            id: 2,
            max_weight: 7000,
            latitude: constants.station[0].latitude,
            longitude: constants.station[0].longitude,
            current_position: 12,
            cumulative_distance: 0,
            atStop: false
        },
        {
            id: 3,
            max_weight: 7000,
            latitude: constants.station[0].latitude,
            longitude: constants.station[0].longitude,
            current_position: 12,
            cumulative_distance: 0,
            atStop: false
        }
    ]
};
var bus_2 = {
    counter: 0,
    buses: [{
            id: 4,
            max_weight: 7000,
            latitude: constants.station[0].latitude,
            longitude: constants.station[0].longitude,
            current_position: 1,
            cumulative_distance: 0,
            atStop: false
        },
        {
            id: 5,
            max_weight: 7000,
            latitude: constants.station[0].latitude,
            longitude: constants.station[0].longitude,
            current_position: 1,
            cumulative_distance: 0,
            atStop: false
        },
        {
            id: 6,
            max_weight: 7000,
            latitude: constants.station[0].latitude,
            longitude: constants.station[0].longitude,
            current_position: 1,
            cumulative_distance: 0,
            atStop: false
        }
    ]
};
var bus_3 = {
    counter: 0,
    buses: [{
            id: 7,
            max_weight: 7000,
            latitude: constants.station[0].latitude,
            longitude: constants.station[0].longitude,
            current_position: 1,
            cumulative_distance: 0,
            atStop: false
        },
        {
            id: 8,
            max_weight: 7000,
            latitude: constants.station[0].latitude,
            longitude: constants.station[0].longitude,
            current_position: 1,
            cumulative_distance: 0,
            atStop: false
        },
        {
            id: 9,
            max_weight: 7000,
            latitude: constants.station[0].latitude,
            longitude: constants.station[0].longitude,
            current_position: 1,
            cumulative_distance: 0,
            atStop: false
        }
    ]
};
var bus_4 = {
    counter: 0,
    buses: [{
            id: 10,
            max_weight: 7000,
            latitude: constants.station[0].latitude,
            longitude: constants.station[0].longitude,
            current_position: 19,
            cumulative_distance: 0,
            atStop: false
        },
        {
            id: 11,
            max_weight: 7000,
            latitude: constants.station[0].latitude,
            longitude: constants.station[0].longitude,
            current_position: 19,
            cumulative_distance: 0,
            atStop: false
        },
        {
            id: 12,
            max_weight: 7000,
            latitude: constants.station[0].latitude,
            longitude: constants.station[0].longitude,
            current_position: 19,
            cumulative_distance: 0,
            atStop: false
        }
    ]
};
var buses = [
    bus_1,
    bus_2,
    bus_3,
    bus_4
];

var measure = function (lat1, lon1, lat2, lon2) { // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d * 1000; // meters
};

var calculatePath = function () {
    var allPath = [
        constants.routeCoordinates_1,
        constants.routeCoordinates_2,
        constants.routeCoordinates_3,
        constants.routeCoordinates_4
    ];
    var allPathMeter = [];
    allPath.map(line => {
        var sum = 0;
        for (let i = 0; i < line.length - 1; i++) {
            sum += measure(line[0].latitude, line[0].longitude, line[1].latitude, line[1].longitude);
        }
        allPathMeter.push(sum);
    });
    return allPathMeter;
};

var calculateSpeed = function () {
    var path = calculatePath();
    var speed = [];
    for (let i = 0; i < path.length; i++) {
        speed.push(path[i] / (constants.time_consume[i] * 60));
    }
    return speed;
}

var busPositionUpdate = schedule.scheduleJob('* * * * * *', function () {
    var route = [
        constants.routeCoordinates_1,
        constants.routeCoordinates_2,
        constants.routeCoordinates_3,
        constants.routeCoordinates_4
    ];

    for (let i = 0; i < route.length; i++) {
        for (let j = 0; j < buses[i].buses.length; j++) {
            if (buses[i].counter > constants.time_delay[i] * j * 60) {
                buses[i].buses[j].cumulative_distance += calculateSpeed()[i];
                var distance = calculateSpeed()[i] * RAD;
                var startPos = {
                    latitude: buses[i].buses[j].latitude,
                    longitude: buses[i].buses[j].longitude
                };
                var endPos = {
                    latitude: route[i][buses[i].buses[j].current_position].latitude,
                    longitude: route[i][buses[i].buses[j].current_position].longitude
                };
                var x = endPos.latitude - startPos.latitude;
                var y = endPos.longitude - startPos.longitude;
                var unitVector = math.matrix([x / math.sqrt(x * x + y * y), y / math.sqrt(x * x + y * y)]);
                var directionVector = math.matrix([unitVector._data[0] * distance, unitVector._data[1] * distance]);
                var linePass = constants.station.filter(station => {
                    return station.line.indexOf(i) !== -1;
                });
                if (isAtStop(linePass, buses[i].buses[j])) {
                    buses[i].buses[j].latitude += directionVector._data[0] / 10;
                    buses[i].buses[j].longitude += directionVector._data[1] / 10;
                    buses[i].buses[j].atStop = true;
                } else {
                    buses[i].buses[j].latitude += directionVector._data[0];
                    buses[i].buses[j].longitude += directionVector._data[1];
                    buses[i].buses[j].atStop = false;
                }
                if (isBetween(startPos, buses[i].buses[j], route[i][buses[i].buses[j].current_position])) {
                    buses[i].buses[j].current_position = (buses[i].buses[j].current_position + 1) % route[i].length;
                }
            }
        }
        buses[i].counter++;
    }
});

function isBetween(startPos, endPos, point) {
    var firstVector = math.matrix([endPos.latitude - startPos.latitude, endPos.longitude - startPos.longitude]);
    var secondVector = math.matrix([endPos.latitude - point.latitude, endPos.longitude - point.longitude]);
    var kAc = math.dot(firstVector, secondVector);
    var kAb = math.dot(firstVector, firstVector);
    return 0 < kAc && kAc < kAb;
}

function isAtStop(linePass, position) {
    for (let i = 0; i < linePass.length; i++) {
        if (math.pow(position.latitude - linePass[i].latitude, 2) + math.pow(position.longitude - linePass[i].longitude, 2) < math.pow(5 * RAD, 2)) {
            return true;
        }
    }
}

var getCurrentPostion = function () {
    var returnObject = [];
    for (let i = 0; i < buses.length; i++) {
        for (let j = 0; j < buses[i].buses.length; j++) {
            returnObject.push({
                id: buses[i].buses[j].id,
                latitude: buses[i].buses[j].latitude,
                longitude: buses[i].buses[j].longitude,
                line: i
            });
        }
    }
    return returnObject;
}

module.exports = {
    calculatePath: calculatePath,
    calculateSpeed: calculateSpeed,
    getCurrentPosition: getCurrentPostion
};