(function() {
	"use strict";
	var apiInterface = angular.module("apiInterface", ["ngCordova"]);
	// apiInterface.config(['$httpProvider', function($httpProvider) {
	// 	$httpProvider.defaults.headers.common = {};
	// 	$httpProvider.defaults.headers.post = {};
	// 	$httpProvider.defaults.headers.put = {};
	// 	$httpProvider.defaults.headers.delete = {};
	// }]);

	// Business Objects
	apiInterface.factory("BO", ["$http", "$q", "ngcConnect", function($http, $q, ngcConnect) {

		var getData = function(tableName, recordID, securityID, format = 'json') {
			return ngcConnect.validateConnection().then(function(sessionInfo) {
				var isValid, url, req, promise;

				isValid = sessionInfo.data.IsAuthenticated;

				if(isValid) {
					url = "api/bo/" + tableName + "/" + recordID + "/" + format + "/none/" + sessionInfo.data.sessionid;
					req = ngcConnect.requestData(url, "GET", { "securityID": securityID });
					promise = $http(req);
				} else {
					promise = ngcConnect.errorHandler("Authentication Failed");
				}

				return promise;
			});
		};
		var updateData = function(tableName, recordID, data, securityID, format = 'json') {
			return ngcConnect.validateConnection().then(function(sessionInfo) {
				var isValid, url, req, promise;

				isValid = sessionInfo.data.IsAuthenticated;

				if(isValid) {
					url = "api/bo/" + tableName + "/" + recordID + "/" + format + "/none/" + sessionInfo.data.sessionid;
					req = ngcConnect.requestData(url, "POST", { "securityID": securityID });
					promise = $http(req);
				} else {
					promise = ngcConnect.errorHandler("Authentication Failed");
				}
				return promise;
			});
		};

		var deleteData = function(tableName, recordID, securityID, options = "none", format = 'json') {
			return ngcConnect.validateConnection().then(function(sessionInfo) {
				var isValid, url, req, promise;

				isValid = sessionInfo.data.IsAuthenticated;

				if(isValid) {
					url = "api/bo/" + tableName + "/" + recordID + "/" + format + "/" + options + "/" + sessionInfo.data.sessionid;
					req = ngcConnect.requestData(url, "DELETE", { "securityID": securityID });
					promise = $http(req);
				} else {
					promise = ngcConnect.errorHandler("Authentication Failed");
				}

				return promise;
			});
		};

		var insertData = function(tableName, data, securityID, format = 'json') {
			return ngcConnect.validateConnection().then(function(sessionInfo) {
				var isValid, url, req, promise;

				isValid = sessionInfo.data.IsAuthenticated;

				if(isValid) {
					url = "api/bo/" + tableName + "/new/" + format + "/none/" + sessionInfo.data.sessionid;
					req = ngcConnect.requestData(url, "PUT", { "securityID": securityID });
					promise = $http(req);
				} else {
					promise = ngcConnect.errorHandler("Authentication Failed");
				}
				return promise;
			});
		};

		return {
			getData: getData,
			updateData: updateData,
			deleteData: deleteData,
			insertData: insertData
		};

	}]);

	//Business Processes

	apiInterface.factory('BP', ["$http", "ngcConnect", function($http, ngcConnect) {

		function ExecuteBP(BPName, parameters, format) {
			return ngcConnect.validateConnection().then(function(sessionInfo) {
				var isValid, url, req, promise;

				isValid = sessionInfo.data.IsAuthenticated;

				if(isValid) {
					url = "api/bp/" + BPName + "/" + format + "/" + sessionInfo.data.sessionid;
					req = ngcConnect.requestData(url, "POST", {}, parameters);

					promise = $http(req);
				} else {
					promise = ngcConnect.errorHandler("Authentication Failed");
				}

				return promise;
			});
		}

		return {
			exec: ExecuteBP
		};
	}]);


	apiInterface.factory("ngcConnect", ["$http", "$q", "registration", function($http, $q, registration) {

		function authenticateUser() {
			var __sessionID;
			var promise = getToken().then(function(response) {
				var sessionInfo = response.data;
				__sessionID = sessionInfo.sessionid;
				return verifyToken(sessionInfo);
			});
			return promise;
		}

		function getToken() {
			var url = "api/auth/requesttoken";
			var req = requestData(url, "GET", registration.settings());
			return $http(req);
		}

		function verifyToken(sessionInfo) {

			var appid = registration.settings().applicationkey;
			var hashedToken = btoa(appid + sessionInfo.token);
			var partialURL = "api/auth/verifytoken/" + sessionInfo.sessionid + "/" + hashedToken;
			var req = requestData(partialURL, "GET");
			return $http(req);
		}

		function requestData(url, httpMethod, parameters, data) {
			var partialURL = url;
			var params = registration.settings();
			var apiURL = params.url + partialURL;

			var req = {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				method: httpMethod,
				url: apiURL,
				params: parameters,
				data: data,
				errorHandler: errorHandler
			};

			return req;
		}

		function errorHandler(message) {
			return $q.reject(message);
		}

		return {
			requestData: requestData,
			validateConnection: authenticateUser
		};
	}]);

	apiInterface.factory('registration', function() {
		return {
			settings: function() {
				var config = JSON.parse(localStorage.getItem("connectionsettings") || '{}');
				config.appid = localStorage.getItem("__APPID");
				config.device = localStorage.getItem("__DEVICE");
				return config;
			}
		};
	});

})();
