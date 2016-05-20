(function() {
	var apiInterface = angular.module("apiInterface", ["ngCordova"]);

	apiInterface.factory("BO", ["$http", "$q", function($http, $q) {

		var getData = function(tableName, ID, securityID, format = 'json') {
			return validateConnection().then(function(sessionInfo) {
				var isValid, url, req, promise;

				isValid = sessionInfo.data.IsAuthenticated;

				if(isValid) {
					url = "api/bo/" + tableName + "/" + ID + "/" + format + "/none/" + sessionInfo.data.sessionid + "/?securityID=" + securityID;
					req = requestData(url);
					promise = $http(req);
				} else {
					promise = errorHandler("Authentication Failed");
				}

				return promise;
			})
		}

		return {
			getData: getData
		}

		function validateConnection() {
			var __sessionID;
			var promise = getToken().then(function(response) {
				var sessionInfo = response.data;
				__sessionID = sessionInfo.sessionid;
				return verifyToken(sessionInfo);
			})
			return promise;
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
			return $http(req);
		}

		function verifyToken(sessionInfo) {

			var appid = getCredentials().applicationkey;
			var hashedToken = btoa(appid + sessionInfo.token);
			var partialURL = "api/auth/verifytoken/" + sessionInfo.sessionid + "/" + hashedToken;
			var req = requestData(partialURL);

			return $http(req);
		}

		function getCredentials() {
			return JSON.parse(localStorage.getItem("connectionsettings") || '{}');
		}

		function systemURL() {
			//return "http://dev07/dadev/";
			return "http://localhost:15971/"
		}

		function errorHandler(message) {
			return $q.reject(message);
		}

	}]);
})();
