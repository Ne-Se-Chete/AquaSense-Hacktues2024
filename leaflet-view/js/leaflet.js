const leaflet = angular.module('leaflet', ['ideUI', 'ideView']);

leaflet.controller('LeafletViewController', ['$scope', '$document', 'messageHub', 'ViewParameters', function ($scope, $document, messageHub, ViewParameters) {
    $scope.state = {
        isBusy: true,
        error: false,
        busyText: "Loading...",
    };

    $scope.loadMap = function () {
        let map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
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