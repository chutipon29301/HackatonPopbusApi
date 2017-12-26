var variables = require('./variables');

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
        console.log(path[i]);
        console.log(variables.time_consume[i]);
        console.log(variables.time_consume[i] * 60);
        speed.push(path[i] / (variables.time_consume[i] * 60));
    }
    return speed;
}
module.exports = {
    calculatePath: calculatePath,
    calculateSpeed: calculateSpeed
};