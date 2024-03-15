const leaflet = angular.module('leaflet', ['ideUI', 'ideView']);

const URL_GET_DATA = "/services/ts/server/gen/api/SensorData/SensorDataService.ts"

leaflet.controller('LeafletViewController', ['$scope', "$http", '$document', 'messageHub', 'ViewParameters', function ($scope, $http, $document, messageHub, ViewParameters) {
    $scope.state = {
        isBusy: true,
        error: false,
        busyText: "Loading...",
    };

    $scope.loadMap = function () {
        var map = L.map('map');

        var customMarker = L.Marker.extend({
            options: {
                time: "",
                pH: 0
            }
        });


        let data = [{
            latitude: 43.2321,
            longitude: 23.4563,
            time: "08:09",
            pH: 7
        }];

        $http.get(URL_GET_DATA)
            .then(
                (response) => {
                    console.log(response.data);
                    data = response.data
                },
                (error) => {
                    console.log(`Response: ${JSON.stringify(error)}`);
                }
            );


        // var data = [{
        //     latitude: 43.2321,
        //     longitude: 23.4563,
        //     time: "08:09",
        //     pH: 7
        // },
        // {
        //     latitude: 42.6499,
        //     longitude: 23.3638,
        //     time: "09:15",
        //     pH: 8
        // },
        // {
        //     latitude: 42.6535,
        //     longitude: 23.3727,
        //     time: "12:37",
        //     pH: 4
        // },
        // {
        //     latitude: 42.6698,
        //     longitude: 23.3836,
        //     // time: "03:48",
        //     time: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        //     pH: 5.6
        // }
        // ]


        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                map.setView([latitude, longitude], 15);
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }


        function createMarker(object) {
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
        $scope.state.isBusy = false;
    };

    // Get the view parameters. If you don't need this, you can remove ViewParameters altogether.
    // If you do, then you can check if the parameter you need is provided using `if (!$scope.dataParameters.hasOwnProperty(<param-name>))`
    // If there is an error, you need to set the state:
    // $scope.state.error = true;
    // $scope.errorMessage = "The 'file' data parameter is missing.";
    $scope.dataParameters = ViewParameters.get();
    angular.element($document[0]).ready(function () {
        $scope.$apply(function () {
            $scope.loadMap();
        });
    });
}]);