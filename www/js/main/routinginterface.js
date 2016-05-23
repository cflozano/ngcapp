(function() {
	var apiInterface = angular.module("apiInterface", ["ngCordova"]);
	// Business Objects
	apiInterface.factory("BO", ["$http", "$q","ngcConnect", function($http, $q, ngcConnect) {

		var getData = function(tableName, recordID, securityID, format = 'json') {
			return ngcConnect.validateConnection().then(function(sessionInfo) {
				var isValid, url, req, promise;

				isValid = sessionInfo.data.IsAuthenticated;

				if(isValid) {
					url = "api/bo/" + tableName + "/" + recordID + "/" + format + "/none/" + sessionInfo.data.sessionid;
					req = ngcConnect.requestData(url, "GET", { "securityID": securityID });
					promise = $http(req);
				} else {
					promise = errorHandler("Authentication Failed");
				}

				return promise;
			})
		}

		var updateData = function(tableName, recordID, data, securityID, format = 'json') {
			return ngcConnect.validateConnection().then(function() {
				var isValid, url, req, promise;

				isValid = sessionInfo.data.IsAuthenticated;

				if(isValid) {
					url = "api/bo/" + tableName + "/" + recordID + "/" + format + "/none/" + sessionInfo.data.sessionid;
					req = ngcConnect.requestData(url, "POST", { "securityID": securityID });
					promise = $http(req);
				} else {
					promise = errorHandler("Authentication Failed");
				}
				return promise;
			})
		}

		var deleteData = function(tableName, recordID, securityID, options = "none", format = 'json') {
			return validateConnection().then(function(sessionInfo) {
				var isValid, url, req, promise;

				isValid = sessionInfo.data.IsAuthenticated;

				if(isValid) {
					url = "api/bo/" + tableName + "/" + recordID + "/" + format + "/" + options + "/" + sessionInfo.data.sessionid;
					req = requestData(url, "DELETE", { "securityID": securityID });
					promise = $http(req);
				} else {
					promise = errorHandler("Authentication Failed");
				}

				return promise;
			})
		}

		var insertData = function(tableName, data, securityID, format = 'json') {
			return validateConnection().then(function() {
				var isValid, url, req, promise;

				isValid = sessionInfo.data.IsAuthenticated;

				if(isValid) {
					url = "api/bo/" + tableName + "/new/" + format + "/none/" + sessionInfo.data.sessionid;
					req = requestData(url, "PUT", { "securityID": securityID });
					promise = $http(req);
				} else {
					promise = errorHandler("Authentication Failed");
				}
				return promise;
			})
		}

		return {
			getData: getData,
			updateData: updateData,
			deleteData: deleteData,
			insertData: insertData
		}


		/*Auxiliary functions*/
		// function validateConnection() {
			// var __sessionID;
			// var promise = getToken().then(function(response) {
			// 	var sessionInfo = response.data;
			// 	__sessionID = sessionInfo.sessionid;
			// 	return verifyToken(sessionInfo);
			// })
			// return promise;
		// }

		// function requestData(url, httpMethod = 'GET', parameters, data) {
		// 	var partialURL = url;
		// 	var apiURL = systemURL() + partialURL;
		// 	var params = getCredentials();
		// 	if(parameters) {
		// 		params = angular.extend(params, parameters);
		// 	}

		// 	var req = {
		// 		method: httpMethod,
		// 		url: apiURL,
		// 		params: params,
		// 		data: data
		// 	}

		// 	return req;
		// }

		// function getToken() {
		// 	var url = "api/auth/requesttoken";
		// 	var req = requestData(url)
		// 	req.params["device"] = "001";
		// 	req.params["appid"] = "Browser";
		// 	return $http(req);
		// }

		// function verifyToken(sessionInfo) {

		// 	var appid = getCredentials().applicationkey;
		// 	var hashedToken = btoa(appid + sessionInfo.token);
		// 	var partialURL = "api/auth/verifytoken/" + sessionInfo.sessionid + "/" + hashedToken;
		// 	var req = requestData(partialURL);

		// 	return $http(req);
		// }

		
	}]);

	//Business Processes

	apiInterface.factory('BP', ['$http', function($http) {
		
		function ExecuteBP(BPName, parameters)
		{

		}

		return {Exec: ExecuteBP}
	}])

	
	apiInterface.factory('ngcConnect', ['$http', function(){
		function authenticateUser()
		{
			var __sessionID;
			var promise = getToken().then(function(response) {
				var sessionInfo = response.data;
				__sessionID = sessionInfo.sessionid;
				return verifyToken(sessionInfo);
			})
			return promise;
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

		function requestData(url, httpMethod = 'GET', parameters, data) {
			var partialURL = url;
			var apiURL = systemURL() + partialURL;
			var params = getCredentials();
			if(parameters) {
				params = angular.extend(params, parameters);
			}

			var req = {
				method: httpMethod,
				url: apiURL,
				params: params,
				data: data
			}

			return req;
		}

		function getCredentials() {
			return JSON.parse(localStorage.getItem("connectionsettings") || '{}');
		}

		function systemURL() {
			return "http://dev07/dadev/";
			//return "http://localhost:15971/"
		}

		function errorHandler(message) {
			return $q.reject(message);
		}

		return {
			validateConnection: authenticateUser,
			requestData: requestData
		};
	}])

})();
