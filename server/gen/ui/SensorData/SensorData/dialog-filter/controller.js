angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'server.SensorData.SensorData';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/server/gen/api/SensorData/SensorDataService.ts";
	}])
	.controller('PageController', ['$scope', 'messageHub', 'entityApi', function ($scope, messageHub, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};

		if (window != null && window.frameElement != null && window.frameElement.hasAttribute("data-parameters")) {
			let dataParameters = window.frameElement.getAttribute("data-parameters");
			if (dataParameters) {
				let params = JSON.parse(dataParameters);
				if (params?.entity?.DateTimeFrom) {
					params.entity.DateTimeFrom = new Date(params.entity.DateTimeFrom);
				}
				if (params?.entity?.DateTimeTo) {
					params.entity.DateTimeTo = new Date(params.entity.DateTimeTo);
				}
				$scope.entity = params.entity ?? {};
				$scope.selectedMainEntityKey = params.selectedMainEntityKey;
				$scope.selectedMainEntityId = params.selectedMainEntityId;
			}
		}

		$scope.filter = function () {
			let entity = $scope.entity;
			const filter = {
				$filter: {
					equals: {
					},
					notEquals: {
					},
					contains: {
					},
					greaterThan: {
					},
					greaterThanOrEqual: {
					},
					lessThan: {
					},
					lessThanOrEqual: {
					}
				},
			};
			if (entity.Id) {
				filter.$filter.equals.Id = entity.Id;
			}
			if (entity.Latitude) {
				filter.$filter.equals.Latitude = entity.Latitude;
			}
			if (entity.Longitude) {
				filter.$filter.equals.Longitude = entity.Longitude;
			}
			if (entity.ph) {
				filter.$filter.equals.ph = entity.ph;
			}
			if (entity.typeTrash) {
				filter.$filter.contains.typeTrash = entity.typeTrash;
			}
			if (entity.IsThereOil) {
				filter.$filter.equals.IsThereOil = entity.IsThereOil;
			}
			if (entity.DateTimeFrom) {
				filter.$filter.greaterThanOrEqual.DateTime = entity.DateTimeFrom;
			}
			if (entity.DateTimeTo) {
				filter.$filter.lessThanOrEqual.DateTime = entity.DateTimeTo;
			}
			messageHub.postMessage("entitySearch", {
				entity: entity,
				filter: filter
			});
			$scope.cancel();
		};

		$scope.resetFilter = function () {
			$scope.entity = {};
			$scope.filter();
		};

		$scope.cancel = function () {
			messageHub.closeDialogWindow("SensorData-filter");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);