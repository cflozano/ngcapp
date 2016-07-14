"use strict";
/*global angular*/
(function() {
	var storageModule = angular.module('storage', []);

	storageModule.factory('ngcsql', [function() {
		var getTable = function(tableName) {

			var tableObject, table;
			var currentTable = auxiliary.getTableName(tableName);

			if(currentTable) {
				table = localStorage.getItem(currentTable);

				if(table) {
					tableObject = angular.fromJson(table);
				}
			}

			return tableObject;
		};

		var setTable = function(tableName, data) {
			var currentTable = auxiliary.getTableName(tableName);
			if(currentTable) {
				localStorage.setItem(currentTable, angular.toJson(data));
			}
		};

		var auxiliary = {
			getTableName: function(table) {
				var prefix = "ngc.";
				var tableName;
				if(table) {
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

	storageModule.factory("DOD", ["ngcsql", function(ngcsql) {
		var objectName = "";
		var dataStored = localStorage.getItem(objectName) || "{}";
		var data = angular.toJson(dataStored);

		var toDelete = function(table, id, childTable, childID) {
			var index;
			var childObject;
			var isHeaderRecord = childTable === undefined;

			if(data[table] === undefined) {
				data[table] = [];
			}

			index = objectIndexOf(data[table], "id", id);
			if(index > -1) {

				if(childTable) {
					childObject = data[table][index].children[childTable];

					if(childObject === undefined) {
						childObject = [];
					}
					childObject.push(childID);
				} else {
					data[table][index].isDeletingHeader = true;
				}
			} else {
				index = data[table].push(new TableBase(id)) - 1;
				if(isHeaderRecord) {
					data[table][index].isDeletingHeader = true;
				} else {
					childObject = data[table][index].children[childTable];

					if(childObject === undefined) {
						data[table][index].children[childTable] = [];
					}
					data[table][index].children[childTable].push(childID);
				}
			}
		};

		function TableBase(id) {
			var table = {};

			table.id = id;
			table.children = {};

			return table;
		}

		function objectIndexOf(arr, property, value) {
			var index = -1;

			for(var i = 0; i < arr.length; i++) {
				if(arr[i][property] === value) {
					index = i;
					break;
				}
			}
			return index;
		}

		return {
			holdDeletion: toDelete
		};
	}]);

})();
