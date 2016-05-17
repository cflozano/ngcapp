(function() {
	var dataConnection = angular.module("datainterface", ["ngcapp"]);

	dataConnection.config(['$httpProvider', function($httpProvider) {
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}]);

	dataConnection.controller("NGCApi", function($scope, $http) {
		$scope.sessionID = '';

		$scope.getToken = function() {
			var partialURL = "api/auth/requesttoken";
			var apiURL = $scope.systemURL() + partialURL;

			var req = {
				method: 'GET',
				url: apiURL,
				params: $scope.credentials()
			}

			$http(req)
				.success(function(response) {
					$scope.sessionInfo = response;
				})
				.error(function(err) {
					$scope.sessionInfo = undefined;
					console.log("Something goes wrong");
				});
		}

		$scope.verifyToken = function() {
			var session = this.sessionInfo;
			var appid = this.credentials().appkey;
			var hashedToken = btoa(appid + session.token);
			var partialURL = "api/auth/verifytoken/" + session.sessionid + "/" + hashedToken;
			var apiURL = $scope.systemURL() + partialURL;

			var req = {
				method: 'GET',
				url: apiURL
			}

			$http(req)
				.success(function(response) {
					$scope.sessionInfo2 = response;
				})
				.catch(function(err) {
					console.log(unescape(err.data));
				});
		}

		$scope.getData = function(tableName, ID, format = 'json') {
			
		}

		$scope.updateData = function() {

		}

		$scope.insertData = function() {

		}

		$scope.deleteData = function() {

		}

		$scope.execBP = function(data) {

		}

		$scope.credentials = function() {
			var settings = JSON.parse(localStorage.getItem("connectionsettings") || '{}');
			return settings;
			/*return {
				user: "EMMA", 
				device: "DELL",
				company: "DEFAULT",
				appid: "DAM",
				appkey: "czrc52zha0"
			};*/
		}

		$scope.systemURL = function() {
			//return "http://dev07/dadev/";
			return "http://localhost:15971/"
		}
	});
})();
