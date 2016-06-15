"use strict";
/*global angular*/
(function() {
    var storageModule = angular.module('storage', []);

    storageModule.factory('ngcsql', [function() {
        var getTable = function(tableName) {
            var initTable = "[]";
            var tableObject, table;
            var currentTable = auxiliary.getTableName(tableName);

            if (currentTable) {
                table = localStorage.getItem(currentTable);

                if (!table) {
                    localStorage.setItem(currentTable, initTable);
                    table = initTable;
                }
                tableObject = angular.fromJson(table);
            }

            return tableObject;
        };

        var setTable = function(tableName, data) {
            var currentTable = auxiliary.getTableName(tableName);
            if (currentTable) {
                localStorage.setItem(currentTable, angular.toJson(data));
            }
        };

        var auxiliary = {
            getTableName: function(table) {
                var prefix = "ngc.";
                var tableName;
                if (table) {
                    tableName = prefix + table;
                }
                return tableName;
            }
        };
        
        return {
            getTable: getTable,
            setTable: setTable
        };
    }]);
})();
