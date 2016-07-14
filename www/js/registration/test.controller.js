"use strict";
/*global angular*/
/*global console*/

(function() {
    var myAPITest = angular.module("ngcTest", ["ngcMain", "apiInterface"]);

    myAPITest.controller("TestCtrl", ["$scope", "BO", "BP", "Records", function($scope, BO, BP, Records) {
        $scope.MyTest = "Result goes here!!";
        $scope.getIt = function() {
            BO.getData("season", 104, 1264).then(function(response) {
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
                    $scope.MyTest = DataObject.id + " was deleted";
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

        $scope.getRecords = function() {
            Records.getData("audit","qa.audit", "qa.audit", "500|3")
                .then(function(response) {
                    $scope.MyTest = "Quantity of audits: " + response.data.length;

                })
                .catch(function(err) {
                    console.log("Error: %o", err);
                });
        };
    }]);

})();
