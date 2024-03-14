const viewData = {
    id: "leaflet",
    label: "Leaflet",
    factory: "frame",
    lazyLoad: true,
    region: "center",
    link: "../leaflet-view/leaflet.html"
};
if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}