var map = L.map('map');
var markers = [];

var customMarker = L.Marker.extend({
    options: {
        time: "",
        PH: 0
    }
});


var data = [{
    latitude: 43.2321,
    longitude: 23.4563,
    time: "08:09",
    PH: 7
},
{
    latitude: 42.6499,
    longitude: 23.3638,
    time: "09:15",
    PH: 8
},
{
    latitude: 42.6535,
    longitude: 23.3727,
    time: "12:37",
    PH: 4
},
{
    latitude: 42.6698,
    longitude: 23.3836,
    time: "03:48",
    PH: 5.6
}
]


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        map.setView([latitude, longitude], 15);
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    });
    } else {
    console.log("Geolocation is not supported by this browser.");
}


function createMarker(object){
    object.forEach(markerData => {
        const marker = new customMarker([markerData.latitude, markerData.longitude], {
            time: markerData.time,
            pH: markerData.pH
        });

        marker.addTo(map)
            .bindPopup(`
                <b>Time:</b> ${marker.options.time}<br>
                <b>pH:</b> ${marker.options.pH}
            `);
    });

}

createMarker(data);