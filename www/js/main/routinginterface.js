/*global angular*/
/*global $q*/
(function() {
	"use strict";
	var apiInterface = angular.module("apiInterface", ["ngCordova", "storage"]);

	/***** Business Objects *****/
	apiInterface.factory("BO", ["$http", "ngcConnect", function($http, ngcConnect) {

		var getData = function(tableName, recordID, securityID, format) {
			format = format || "json";
			return ngcConnect.validateConnection().then(function(sessionInfo) {
				var isValid, url, req, promise;

				isValid = sessionInfo.data.IsAuthenticated;

				if (isValid) {
					url = "api/remote/bo/" + tableName + "/" + recordID + "/" + sessionInfo.data.sessionid + "/" + format;
					req = ngcConnect.requestData(url, "GET", { "securityID": securityID });
					promise = $http(req);
				} else {
					promise = ngcConnect.errorHandler("Authentication Failed");
				}

				return promise;
			});
		};
		
		var updateData = function(tableName, recordID, data, securityID, format) {
			format = format || "json";
			return ngcConnect.validateConnection().then(function(sessionInfo) {
				var isValid, url, req, promise;

				isValid = sessionInfo.data.IsAuthenticated;

				if (isValid) {
					url = "api/remote/bo/" + tableName + "/" + recordID + "/" + sessionInfo.data.sessionid + "/" + format;
					req = ngcConnect.requestData(url, "POST", { "securityID": securityID });
					promise = $http(req);
				} else {
					promise = ngcConnect.errorHandler("Authentication Failed");
				}

				return promise;
			});
		};

		var deleteData = function(tableName, recordID, securityID, options, format) {
			format = format || "json";
			options = options || "none";
			return ngcConnect.validateConnection().then(function(sessionInfo) {
				var isValid, url, req, promise;

				isValid = sessionInfo.data.IsAuthenticated;

				if (isValid) {
					url = "api/remote/bo/" + tableName + "/" + recordID + "/" + sessionInfo.data.sessionid + "/" + format + "/" + options;
					req = ngcConnect.requestData(url, "DELETE", { "securityID": securityID });
					promise = $http(req);
				} else {
					promise = ngcConnect.errorHandler("Authentication Failed");
				}

				return promise;
			});
		};

		var insertData = function(tableName, data, securityID, format) {
			format = format || "json";
			return ngcConnect.validateConnection().then(function(sessionInfo) {
				var isValid, url, req, promise;

				isValid = sessionInfo.data.IsAuthenticated;

				if (isValid) {
					url = "api/remote/bo/" + tableName + "/new/" + sessionInfo.data.sessionid + "/" + format + "/none/" + sessionInfo.data.sessionid;
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

	/***** Business Processes *****/
	apiInterface.service('BP', ["$http", "ngcConnect", function($http, ngcConnect) {

		function ExecuteBP(BPName, parameters, format) {
			return ngcConnect.validateConnection().then(function(sessionInfo) {
				var isValid, url, req, promise;

				isValid = sessionInfo.data.IsAuthenticated;

				if (isValid) {
					url = "api/remote/bp/" + BPName + "/" + sessionInfo.data.sessionid + "/" + format;
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

	/*** Multiple records **/
	apiInterface.service('Records', ['$http', "ngcConnect", "ngcsql", function($http, ngcConnect, ngcsql) {
		function getData(tableName, template, conditionTemplate, condition) {
			return ngcConnect.validateConnection().then(function(sessionInfo) {
				var isValid, url, req, promise;

				isValid = sessionInfo.data.IsAuthenticated;

				if (isValid) {
					url = "api/remote/records/" + template + "/" + conditionTemplate + "/" + sessionInfo.data.sessionid;
					req = ngcConnect.requestData(url, "GET", { "condition": condition });

					promise = $http(req);
				} else {
					promise = ngcConnect.errorHandler("Authentication Failed");
				}

				return promise;
			}).then(function(transport) {
				ngcsql.setTable(tableName, transport.data);
				return transport;
			});
		}
		return {
			getData: getData
		};
	}]);

	apiInterface.service("ngcConnect", ["$http", "registration", function($http, registration) {

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
			var promise;
			var url = "api/auth/requesttoken";
			var parameters = registration.settings();

			if (parameters) {
				var req = requestData(url, "GET", parameters);
				promise = $http(req);
			} else {
				promise = errorHandler("Unable to get the token");
			}

			return promise;
		}

		function verifyToken(sessionInfo) {
			var promise, parameters, appid, hashedToken, partialURL, req;
			parameters = registration.settings();

			if (parameters) {
				appid = parameters.applicationkey;
				hashedToken = btoa(appid + sessionInfo.token);
				partialURL = "api/auth/verifytoken/" + sessionInfo.sessionid + "/" + hashedToken;
				req = requestData(partialURL, "GET");
				promise = $http(req);
			} else {
				errorHandler("The session could not be verified");
			}
			return promise;
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

	/***** Registration *****/
	apiInterface.service('registration', function() {
		return {
			settings: function() {
				var storedData, config;
				storedData = localStorage.getItem("connectionsettings");
				if (storedData) {
					config = JSON.parse(localStorage.getItem("connectionsettings"));
					config.appid = localStorage.getItem("__APPID");
					config.device = localStorage.getItem("__DEVICE");
				}
				return config;
			}
		};
	});

})();
