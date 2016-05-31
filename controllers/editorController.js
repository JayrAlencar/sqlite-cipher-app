"use strict";
app.controller("editorController", function($scope, databaseService){
	$scope.init = function(){
		databaseService.getConnecteds(function(res){
			$scope.databases = res;
		});
	}

	$scope.run = function(){
		$scope.connection.connection.connect($scope.connection.path, $scope.connection.password, $scope.connection.algorithm)

		var sql = $($scope.editorContent).text();


		$scope.connection.connection.run(sql, function(res){
			console.log(res)
		});
	}

	function executing(sql){

	}
});