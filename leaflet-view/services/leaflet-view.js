const viewData = {
    id: "leaflet",
    label: "Leaflet",
    perspective: "SensorData",
    view: "SensorData",
    type: "page",
    link: "/services/web/leaflet-view/leaflet.html"
};
if (typeof exports !== 'undefined') {
    exports.getAction = function () {
        return viewData;
    }
}