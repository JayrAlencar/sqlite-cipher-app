"use strict";
app.controller("editorController", function($scope, databaseService){
	$scope.init = function(){
		databaseService.getConnecteds(function(res){
			$scope.databases = res;
		});
	}

	$scope.modifyContent = function(){
		// console.log($scope.editorContent)
	}

	$scope.run = function(){
		console.log($scope.connection)
		$scope.connection.connection.run($scope.editorContent, function(res){
			console.log(res)
		});
	}
});