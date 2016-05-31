"use strict";
app.controller("mainController", function($scope){
	var sqlite = require("sqlite-cipher");

	$scope.algorithms = sqlite.algorithms;

	$scope.btnTest = "Test connection";

	$scope.app = basel.config;
	$scope.menus = basel.database.run("SELECT * FROM crud WHERE ativo = 1 AND show_menu = 1");

	$scope.connection = {};

	for(var i = 0 ; i < $scope.menus.length; i++){
		$scope.menus[i].active = true;
	}

	$scope.tabs = [
	{
		name:'Home',
		view:'home.html',
		active: true
	}
	];

	$scope.addTab = function(options){
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
		
	}

	$scope.activeMe = function(data){
		for(i in $scope.tabs){
			$scope.tabs[i].active = false;
		}
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
			}
		}catch(c){
			alert(c)
		}
	}

	$scope.connectSave = function(){
		
	}
});