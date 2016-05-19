(function() {
	var apiInterface = angular.module("apiInterface", ["ngCordova"]);

	apiInterface.factory("BO", ["$http", function($http) {

		var getData = function(tableName, ID, format = 'json') {
			getToken();
		}

		return {
			getData: getData
		}

		/*Auxiliary functions*/
		function requestData(url, httpMethod = 'GET') {
			var partialURL = url;
			var apiURL = systemURL() + partialURL;

			var req = {
				method: httpMethod,
				url: apiURL,
				params: getCredentials()
			}

			return req;
		}

		function getToken() {
			var url = "api/auth/requesttoken";
			var req = requestData(url)
			req.params["device"] = "001";
			req.params["appid"] = "Browser";

			$http(req)
				.success(function(response) {
					this.sessionInfo = response;
					verifyToken();
				})
				.error(function(err) {
					this.sessionInfo = undefined;
					console.log("Something goes wrong");
				});
		}

		function verifyToken() {

			var appid = getCredentials().appkey;
			var hashedToken = btoa(appid + session.token);
			var partialURL = "api/auth/verifytoken/" + session.sessionid + "/" + hashedToken;

			$http(req)
				.success(function(response) {
					$scope.sessionInfo2 = response;
				})
				.catch(function(err) {
					console.log(unescape(err.data));
				});
		}

		function getCredentials() {
			return JSON.parse(localStorage.getItem("connectionsettings") || '{}');;
		}

		function systemURL() {
			//return "http://dev07/dadev/";
			return "http://localhost:15971/"
		}


	}]);
})();
