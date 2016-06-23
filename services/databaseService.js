app.service('databaseService', function() {
	var databases = [];

	var actions = {};

	actions.addDatabase = function(data){
		basel.database.insert('databases', data);
	}

	actions.getDatabase = function(callback){
		basel.database.run("SELECT * FROM databases WHERE active = 1", function(res){
			callback(res);
		})
	}

	actions.getConnecteds = function(callback){
		callback(basel.database.run("SELECT * FROM databases WHERE active = 1 AND connected = 1"));
	}

	actions.connect = function(data){
		databases.push(data);
		basel.database.update('databases',{connected: 1},{id: data.id});
	}

	actions.disconnect = function(data){
		basel.database.update('databases',{connected:0},{id:data.id})
	}

	actions.remove = function(data){
		basel.database.update('databases',{active:0},{id:data.id})
	}

	actions.disconnectAll = function(){
		var databases = [];
		basel.database.update('databases',{connected: 0},{});
	}

	actions.getFunctions = function(id, callback){
		basel.database.run("SELECT * FROM functions WHERE active = 1 AND id_database = ?",[id], function(res){
			callback(res)
		});
	}

	actions.getFunctionsAsync = function(id){
		return basel.database.run("SELECT * FROM functions WHERE active = 1 AND id_database = ?",[id]);
	}

	actions.addFunction = function(data, callback){
		basel.database.insert('functions', data, function(res){
			callback(res)
		});
	}

	actions.editFunction = function(data, callback){
		var json = JSON.parse(angular.toJson(data));
		var id = json.id;
		delete json.id;

		basel.database.update('functions',json, {id: id}, function(d){
			callback(d);
		});
	}

	actions.deleteFunction = function(id, callback){
		basel.database.update('functions',{active:0}, {id: id}, function(d){
			callback(d);
		});
	}

	return actions;
});