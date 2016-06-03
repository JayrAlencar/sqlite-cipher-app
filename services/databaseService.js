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

	actions.disconnectAll = function(){
		var databases = [];
		basel.database.update('databases',{connected: 0},{});
	}

	return actions;
});