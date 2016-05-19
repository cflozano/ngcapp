(function() {
	var ngcUser = angular.module("ngcUser", []);

	ngcUser.controller("UserCtrl", ["$scope", "$cordovaDevice", function($scope, $cordovaDevice) {
		$scope.register = function() {
			var userKey = this.key;

			if(userKey) {
				var decodedKey = atob(userKey).split('|');
				if(decodedKey.length > 3) {
					var userConnection = {
						url: decodedKey[0],
						user: decodedKey[1],
						applicationkey: decodedKey[2],
						company: decodedKey[3]
					}
					window.localStorage.setItem("connectionsettings", JSON.stringify(userConnection));
				}
			}
		}

	}])
})();
