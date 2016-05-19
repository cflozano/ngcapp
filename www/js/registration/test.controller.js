(function() {
	var myAPITest = angular.module("ngcTest", ["ngcMain", "apiInterface"]);

	myAPITest.controller("TestCtrl", ["$scope","BO", function($scope, BO){
		$scope.MyTest = "<-";
		 $scope.getIt = function(){
		 	BO.getData("season", 5);
		 }
	}]);

})();
