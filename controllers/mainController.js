"use strict";
app.controller("mainController", function($scope, $controller, databaseService){

	const app  = require('electron');

    var remote = app.remote; 
    var dialog = remote.dialog; 
    var globalShortcut = remote.globalShortcut;
	var sqlite = require("sqlite-cipher");

	// console.log($controller)

	databaseService.disconnectAll();

	$scope.algorithms = sqlite.algorithms;

	$scope.btnTest = "Test connection";

	$scope.app = basel.config;
	$scope.app.title += " - v0.0.25";
	$scope.menus = basel.database.run("SELECT * FROM crud WHERE ativo = 1 AND show_menu = 1");

	$scope.connection = {};

	for(var i = 0 ; i < $scope.menus.length; i++){
		$scope.menus[i].active = true;
	}

	$scope.tabs = [
	{
		name:'Home',
		view:'home.html',
		active: true,
		controller: homeController,
		id: 1
	}
	];

	$scope.addTab = function(options){
		globalShortcut.unregisterAll();
		options.id = options.id || (new Date()).getTime();
		if($scope.tabs.indexOf(options) < 0){
			if(options.active){
				for(i in $scope.tabs){
					$scope.tabs[i].active = false;
				}
			}
			$scope.tabs.push(options);	
		}else{
			for(i in $scope.tabs){
				$scope.tabs[i].active = false;
			}
			$scope.tabs[$scope.tabs.indexOf(options)].active = true;
		}
		$scope.$broadcast('activeTab',{tab_id: options.id});
	}

	$scope.activeMe = function(data){
		for(i in $scope.tabs){
			$scope.tabs[i].active = false;
		}
		globalShortcut.unregisterAll();
		$scope.$broadcast('activeTab',{tab_id: data.id});
		data.active = true;
	}

	$scope.close = function(data){
		$scope.tabs.splice( $scope.tabs.indexOf(data), 1 );
		if(data.active && $scope.tabs.length>0){
			$scope.tabs[0].active = true;
		}
	}

	$scope.newConnection = function(){
		$('#modalConnction').modal('show');
	}

	$scope.callFileInput = function(){
		$("#file").click();
	}

	$scope.uploadFile = function(){
		var filename = event.target.files[0];
		$scope.connection.path = filename.path;
		$scope.connection.alias = (((filename.path.split('\\')).slice(-1).pop()).split('.'))[0];
		$scope.$apply();
	};

	$scope.testConnection = function(){
		try{
			sqlite.connect($scope.connection.path, $scope.connection.password, $scope.connection.algorithm);
			var res = sqlite.run("CREATE TABLE jayr(name TEXT)");
			if(res.error){
				console.log(res.error);
				alert("Invalid Password! Please check your password or database name.");
			}else{
				$scope.btnTest = "Tested"
				sqlite.run("DROP TABLE jayr");
				sqlite.close();
			}
		}catch(c){
			alert(c)
		}
	}

	$scope.connectSave = function(){
		try{
			sqlite.connect($scope.connection.path, $scope.connection.password, $scope.connection.algorithm);
			var res = sqlite.run("CREATE TABLE jayr(name TEXT)");
			if(res.error){
				console.log(res.error);
				alert("Invalid Password! Please check your password or database name.");
			}else{
				$('#modalConnction').modal('hide');
				sqlite.run("DROP TABLE jayr");
				databaseService.addDatabase($scope.connection);
				databaseService.connect($scope.connection);
				$scope.$broadcast('newConnection',[]);
				$scope.getDatabases();
				sqlite.close();
			}
		}catch(c){
			alert(c)
		}
	}

	$scope.getConnected = function(){
		databaseService.getConnecteds(function(res){
			$scope.connecteds = res;	
		})
		
	}

	$scope.getDatabases = function(){
		$scope.getConnected();
		databaseService.getDatabase(function(res){
			$scope.databases = res;
			for(var i in $scope.databases){

				var base = $scope.databases[i];
				if(base.connected){
					console.log(base.path)
					var sq = require('sqlite-cipher');
					sq.connect(base.path, base.password, base.algorithm);
					sq.run("SELECT * FROM sqlite_master WHERE type = 'table' AND name <> 'sqlite_sequence'", function(tables){
						console.log(tables)
						$scope.databases[i].tables = tables;
						sq.close();
					});
				}
				
			}
		});
	}

	function isConnected(data){
		for(i in $scope.connecteds){
			if($scope.connecteds[i].id == data.id){
				return true;
			}
		}
		return false;
	}

	$scope.connect = function(base){
		databaseService.connect(base);
		$scope.$broadcast('newConnection',[]);
		var sq = require('sqlite-cipher');
		sq.connect(base.path, base.password, base.algorithm);
		sq.run("SELECT * FROM sqlite_master WHERE type = 'table' AND name <> 'sqlite_sequence'", function(tables){
			base.tables = tables;
			base.connected = true;
			sq.close();
		});
	}

	$scope.newEditor = function(data){
		$scope.addTab({
			active: true, 
			view: 'editor.html', 
			name: 'Editor',
			controller: editorController
		});
	}

	$scope.$on("change",function(e,a){
		$scope.getDatabases();
	})
});