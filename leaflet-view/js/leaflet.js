const leaflet = angular.module('leaflet', ['ideUI', 'ideView']);

const URL_GET_DATA = "/services/ts/server/gen/api/SensorData/SensorDataService.ts"

// sets up the request data for chatgpt
function getRequestData(information, tokens) {
    return {
        model: "gpt-4",
        messages: [
            // {
            //     role: "system",
            //     content: "You are an assistant."
            // },
            {
                role: "user",
                content: information
            }
        ],
        max_tokens: tokens
    };
}

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
                gptPrompt: "",
                ph: 7,
                typeTrash: "",
                IsThereOil: "",
                DateTime: "08:09"
            }
        });

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
            map.setView([0, 0], 15);
            console.log("Geolocation is not supported by this browser.");
        }


        function createMarker(object) {
            let markers = [];

            object.forEach(markerData => {
                //creates a new marker
                let marker = new customMarker([markerData.Latitude, markerData.Longitude], {
                    gptPrompt: markerData.gptPrompt || "",
                    ph: markerData.ph,
                    typeTrash: markerData.typeTrash,
                    IsThereOil: markerData.IsThereOil,
                    DateTime: markerData.DateTime
                });


                //setup the message and tokens
                let instruction = `Summorize in 2 sentences what meassuring ${marker.options.ph} ph in an ocean means`;
                let tokens = 60;

                if (marker.options.typeTrash != "none") {
                    instruction += ` what ${marker.options.typeTrash} in the watter means`
                    tokens += 20
                }

                if (marker.options.IsThereOil) {
                    instruction += " and what oil in the watter means"
                    tokens += 20
                }

                $http.post('https://api.openai.com/v1/chat/completions', getRequestData(instruction, tokens), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + "YOUR_KEY" // Replace YOUR_API_KEY with your actual API key
                    }
                }).then(function (response) {
                    marker.options.gptPrompt = response.data.choices[0].message.content;

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
                },
                    function (_) {
                        let popupContent = document.createElement('div');
                        popupContent.innerHTML = `
                        <div id="popup">
                            <b>Information about event:</b> <br><br>
                            <b>pH:</b> ${marker.options.ph}<br>
                            <b>typeTrash:</b> ${marker.options.typeTrash}<br>
                            <b>IsThereOil:</b> ${marker.options.IsThereOil}<br>
                            <b>DateTime:</b> ${marker.options.DateTime}<br><br>
                        </div>`;

                        markers.push(marker);
                        marker.addTo(map)

                        let popup = L.popup().setContent(popupContent);
                        marker.bindPopup(popup);
                    }
                );
            });
        }

        $http.get(URL_GET_DATA)
            .then((response) => {
                try {
                    createMarker(response.data);
                } catch (e) {
                    alert(e);
                }
                $scope.state.isBusy = false;
            })

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