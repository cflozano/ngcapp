(function() {
	var myAPITest = angular.module("ngcTest", ["ngcMain", "apiInterface"]);

	myAPITest.controller("TestCtrl", ["$scope","BO", function($scope, BO){
		$scope.MyTest = "<-";
		 $scope.getIt = function(){
		 	BO.getData("season", 5, 1264).then(function(response){
		 		var DataObject = response.data;
		 		$scope.MyTest = DataObject.data.Header.season;
		 	})
		 	.catch(function(err){
		 		var message = unescape(err.data || err);
		 		console.log(message);
		 	})
		 }
	}]);

})();
