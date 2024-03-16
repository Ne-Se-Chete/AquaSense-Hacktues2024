var map = L.map('map');

var customMarker = L.Marker.extend({
    options: {
        gptPrompt: "",
        ph: 7,
        typeTrash: "",
        IsThereOil: "",
        DateTime: "08:09"
    }
});


var data = [{
    Latitude: 43.2321,
    Longitude: 23.4563,
    gptPrompt: "",
    ph: 7,
    typeTrash: "",
    IsThereOil: "",
    DateTime: "08:09"
},
{
    Latitude: 42.6499,
    Longitude: 23.3638,
    gptPrompt: "",
    ph: 8,
    typeTrash: "",
    IsThereOil: "",
    DateTime: "09:15"
},
{
    Latitude: 42.6535,
    Longitude: 23.3727,
    gptPrompt: "",
    ph: 4,
    typeTrash: "",
    IsThereOil: "",
    DateTime: "12:37"
},
{
    Latitude: 42.6698,
    Longitude: 23.3836,
    gptPrompt: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    ph: 5.6,
    typeTrash: "Bottle",
    IsThereOil: "No",
    DateTime: "15.03.2024 EET 23:33"
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
        const marker = new customMarker([markerData.Latitude, markerData.Longitude], {
            gptPrompt: markerData.gptPrompt,
            ph: markerData.ph,
            typeTrash: markerData.typeTrash,
            IsThereOil: markerData.IsThereOil,
            DateTime: markerData.DateTime
            
        });

        let popupContent = document.createElement('div');
        popupContent.innerHTML = `
        <div id="popup">
            <b>Information about event:</b> ${marker.options.gptPrompt}<br><br>
            <b>-------------</b><br>
            <b>Raw data</b><br>
            <b>-------------</b><br>
            <b>pH:</b> ${marker.options.ph}<br>
            <b>typeTrash:</b> ${marker.options.typeTrash}<br>
            <b>IsThereOil:</b> ${marker.options.IsThereOil}<br>
            <b>DateTime:</b> ${marker.options.DateTime}<br><br>
        </div>`;

        markers.push(marker);
        marker.addTo(map)

        let popup = L.popup().setContent(popupContent);
        marker.bindPopup(popup);
    });
}

createMarker(data);