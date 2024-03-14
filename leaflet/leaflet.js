var map = L.map('map');
var markers = [];

var customMarker = L.Marker.extend({
    options: {
        time: "",
        PH: 0
    }
});

var LeafIcon = L.Icon.extend({
    options: {
        iconSize:     [38, 60],
        shadowSize:   [50, 64],
        iconAnchor:   [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor:  [-3, -76]
    }
});

var blackIcon = new LeafIcon({iconUrl: '../styles/black_marker.png'}),
    blueIcon = new LeafIcon({iconUrl: '../styles/blue_marker.png'}),
    yellowIcon = new LeafIcon({iconUrl: '../styles/yellow_marker.png'});



L.marker([51.5, -0.09], {icon: blackIcon}).addTo(map).bindPopup("I am a black leaf.");
L.marker([51.495, -0.083], {icon: blueIcon}).addTo(map).bindPopup("I am a blue leaf.");
L.marker([51.49, -0.1], {icon: yellowIcon}).addTo(map).bindPopup("I am an yellow leaf.");


data = [{
    latitude: 43.2321,
    longtitude: 23.4563,
    time: "08:09",
    PH: 7
},
{
    latitude: 33.1248,
    longtitude: 17.9876,
    time: "09:15",
    PH: 8
},
{
    latitude: 41.4621,
    longtitude: 34.5475,
    time: "12:37",
    PH: 4
},
{
    latitude: 39.22191,
    longtitude: 28.3729,
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

marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

/*
function createMarker(object){
    for(let i = 0; i < object.lenght; i++){
        let marker = new customMarker([object[i].latitude, object[i].longitude], {
            
            time: object[i].time,
            PH: object[i].PH
        });
    }
}
*/
