var map = L.map('map');

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
    // time: "03:48",
    time: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    pH: 5.6
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
    let markers = [];

    object.forEach(markerData => {
        const marker = new customMarker([markerData.latitude, markerData.longitude], {
            time: markerData.time,
            pH: markerData.pH
        });
        markers.push(marker);
        marker.addTo(map)
            .bindPopup(`
                <div id="popup">
                    <b>Time:</b> ${marker.options.time}<br>
                    <b>pH:</b> ${marker.options.pH}
                </div>
            `);
    });
}

createMarker(data);