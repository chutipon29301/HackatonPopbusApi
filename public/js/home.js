var socket = io();
getLocation();
var marker = [];

var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: new google.maps.LatLng(13.738360, 100.532170),
    mapTypeId: google.maps.MapTypeId.ROADMAP
});

socket.on('updateLocation', function (msg) {
    getLocation();
});

function getLocation() {
    if (marker) {
        for (let i = 0; i < marker.length; i++) {
            marker[i].setMap(null);
        }
        marker.length = 0;
    }
    $.get('/get/position', function (data, status) {
        var locations = [];
        locations.push([
            't',
            13.735581,
            100.531944
        ]);
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].buses.length; j++) {
                locations.push([
                    '' + (i + 1),
                    data[i].buses[j].latitude,
                    data[i].buses[j].longitude
                ]);
            }
        }

        for (let i = 0; i < locations.length; i++) {
            marker.push(new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                map: map,
                label: locations[i][0],
            }));
        }
    });
}