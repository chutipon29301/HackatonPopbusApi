var variables = require('./variables');
var schedule = require('node-schedule');
var math = require('mathjs');

const RAD = 0.000008998719243599958;

var bus_1 = {
    counter: 0,
    buses: [{
            id: 1,
            max_weight: 7000,
            latitude: variables.station[0].latitude,
            longitude: variables.station[0].longitude,
            current_position: 12,
            cumulative_distance: 0
        },
        {
            id: 2,
            max_weight: 7000,
            latitude: variables.station[0].latitude,
            longitude: variables.station[0].longitude,
            current_position: 12,
            cumulative_distance: 0
        },
        {
            id: 3,
            max_weight: 7000,
            latitude: variables.station[0].latitude,
            longitude: variables.station[0].longitude,
            current_position: 12,
            cumulative_distance: 0
        }
    ]
};
var bus_2 = {
    counter: 0,
    buses: [{
            id: 1,
            max_weight: 7000,
            latitude: variables.station[0].latitude,
            longitude: variables.station[0].longitude,
            current_position: 0,
            cumulative_distance: 0
        },
        {
            id: 2,
            max_weight: 7000,
            latitude: variables.station[0].latitude,
            longitude: variables.station[0].longitude,
            current_position: 0,
            cumulative_distance: 0
        },
        {
            id: 3,
            max_weight: 7000,
            latitude: variables.station[0].latitude,
            longitude: variables.station[0].longitude,
            current_position: 0,
            cumulative_distance: 0
        }
    ]
};
var bus_3 = {
    counter: 0,
    buses: [{
            id: 1,
            max_weight: 7000,
            latitude: variables.station[0].latitude,
            longitude: variables.station[0].longitude,
            current_position: 0,
            cumulative_distance: 0
        },
        {
            id: 2,
            max_weight: 7000,
            latitude: variables.station[0].latitude,
            longitude: variables.station[0].longitude,
            current_position: 0,
            cumulative_distance: 0
        },
        {
            id: 3,
            max_weight: 7000,
            latitude: variables.station[0].latitude,
            longitude: variables.station[0].longitude,
            current_position: 0,
            cumulative_distance: 0
        }
    ]
};
var bus_4 = {
    counter: 0,
    buses: [{
            id: 1,
            max_weight: 7000,
            latitude: variables.station[0].latitude,
            longitude: variables.station[0].longitude,
            current_position: 0,
            cumulative_distance: 0
        },
        {
            id: 2,
            max_weight: 7000,
            latitude: variables.station[0].latitude,
            longitude: variables.station[0].longitude,
            current_position: 0,
            cumulative_distance: 0
        },
        {
            id: 3,
            max_weight: 7000,
            latitude: variables.station[0].latitude,
            longitude: variables.station[0].longitude,
            current_position: 0,
            cumulative_distance: 0
        }
    ]
};
var bus_5 = {
    counter: 0,
    buses: [{
            id: 1,
            max_weight: 7000,
            latitude: variables.station[0].latitude,
            longitude: variables.station[0].longitude,
            current_position: 0,
            cumulative_distance: 0
        },
        {
            id: 2,
            max_weight: 7000,
            latitude: variables.station[0].latitude,
            longitude: variables.station[0].longitude,
            current_position: 0,
            cumulative_distance: 0
        },
        {
            id: 3,
            max_weight: 7000,
            latitude: variables.station[0].latitude,
            longitude: variables.station[0].longitude,
            current_position: 0,
            cumulative_distance: 0
        }
    ]
};
var bus_6 = {
    counter: 0,
    buses: [{
            id: 1,
            max_weight: 7000,
            latitude: variables.station[0].latitude,
            longitude: variables.station[0].longitude,
            current_position: 0,
            cumulative_distance: 0
        },
        {
            id: 2,
            max_weight: 7000,
            latitude: variables.station[0].latitude,
            longitude: variables.station[0].longitude,
            current_position: 0,
            cumulative_distance: 0
        },
        {
            id: 3,
            max_weight: 7000,
            latitude: variables.station[0].latitude,
            longitude: variables.station[0].longitude,
            current_position: 0,
            cumulative_distance: 0
        }
    ]
};
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
        variables.routeCoordinates_1,
        variables.routeCoordinates_2,
        variables.routeCoordinates_3,
        variables.routeCoordinates_4,
        variables.routeCoordinates_5,
        variables.routeCoordinates_6
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
        speed.push(path[i] / (variables.time_consume[i] * 60));
    }
    return speed;
}

var busPositionUpdate = schedule.scheduleJob('* * * * * *', function () {
    var buses = [
        bus_1,
        bus_2,
        bus_3,
        bus_4,
        bus_5,
        bus_6
    ];

    var route = [
        variables.routeCoordinates_1,
        variables.routeCoordinates_2,
        variables.routeCoordinates_3,
        variables.routeCoordinates_4,
        variables.routeCoordinates_5,
        variables.routeCoordinates_6
    ];

    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < buses[i].buses.length; j++) {
            if (buses[i].counter > variables.time_delay[i] * j * 60) {
                buses[i].buses[j].cumulative_distance += calculateSpeed()[i];
                startPos = math.matrix([route[i][buses[i].buses[j].current_position].latitude, route[i][buses[i].buses[j].current_position].longitude]);
                endPos = math.matrix([route[i][buses[i].buses[j].current_position + 1].latitude, route[i][buses[i].buses[j].current_position + 1].longitude]);
                var direction = math.add(endPos, math.multiply(startPos, -1))
                var distance = math.add(math.multiply(direction,1/(Math.sqrt(Math.pow(route[i][buses[i].buses[j].current_position + 1].latitude, 2) + Math.pow(route[i][buses[i].buses[j].current_position + 1].longitude, 2)))), calculateSpeed()[i] * RAD);
                buses[i].buses[j].latitude += distance._data[0];
                buses[i].buses[j].longitude += distance._data[1];
                console.log('Bus ' + i + ' no ' + j + ' distance ', buses[i].buses[j]);
                var linePass = variables.station.filter(station => {
                    return station.line.indexOf(i) !== -1;
                });
            }
        }
        buses[i].counter++;
    }
});

module.exports = {
    calculatePath: calculatePath,
    calculateSpeed: calculateSpeed
};