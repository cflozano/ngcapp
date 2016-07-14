"use strict";
/*global angular*/
/*global ngcsql*/
/*global DOD*/

(function() {
	var dataModule = angular.module("ngc.data", ["storage"]);

	dataModule.service('DataObject', ["storage", function(storage) {
		var tableName, tableObject;
		var initialize = function(tableName) {
			tableName = tableName.toLower();
			tableObject = storage.getTable(tableName);
		};

		var load = function(id) {
			var record;
			for(var i in tableObject) {
				if(tableObject[i]["_id"] == id) {
					record = tableObject[i];
					break;
				}
			}
			return record;
		};

		var update = function(id, data) {
			for(var i in tableObject) {
				if(tableObject[i]["_id"] == id) {
					tableObject[i] = data;
					ngcsql.setTable(tableName, tableObject);
					break;
				}
			}
		};

		var insert = function(data) {
			var newID;
			if(data && typeof(data) == "object") {
				newID = getNewID();
				data["_id"] = newID;
				tableObject.push(data);
				ngcsql.setTable(tableName, tableObject);
			}
			return newID;
		};

		var deleteRecord = function(id) {
			for(var i in tableObject) {
				if(tableObject[i]["_id"] == id) {
					delete tableObject[i];
					DOD.toDelete(tableName, id);
				}
			}
		};

		var getNewID = function() {
			var newID = Date.now();
			return newID;
		};

		return {
			tableName: tableName,
			load: load,
			delete: deleteRecord,
			insert: insert,
			update: update,
			initialize: initialize
		};
	}]);

})();
