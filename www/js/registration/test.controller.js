(function() {
	var myAPITest = angular.module("ngcTest", ["ngcMain", "apiInterface"]);

	myAPITest.controller("TestCtrl", ["$scope", "BO", "BP", function($scope, BO, BP) {
		$scope.MyTest = "Result goes here!!";
		$scope.getIt = function() {
			BO.getData("season", 103, 1264).then(function(response) {
					var DataObject = response.data;
					$scope.MyTest = "Season: " + DataObject.data.Header.season;
				})
				.catch(function(err) {
					var message = decodeURI(err.data || err);
					console.log(message);
				});
		};

		$scope.deleteIt = function() {
			BO.deleteData("season", 103, 1264).then(function(response) {
					var DataObject = response.data;
				})
				.catch(function(err) {
					var message = decodeURI(err.data || err);
					console.log(message);
				});
		};

		$scope.BPTest = function() {
			BP.exec("CountRecords", "tableName=season", "JSON")
				.then(function(response) {
					$scope.MyTest = "Quantity of seasons: " + response.data.IntValue;

				})
				.catch(function(err) {
					console.log("Error: %o", err);
				});
		};
	}]);

})();
