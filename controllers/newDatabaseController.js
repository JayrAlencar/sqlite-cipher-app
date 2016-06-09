app.controller('newDatabaseController', function($scope, databaseService) {
	const app  = require('electron');
	var sqlite = require("sqlite-cipher");
    var remote = app.remote; 
    var dialog = remote.dialog; 
    $scope.new_db = {};
	
	$scope.algorithms = sqlite.algorithms;

	$scope.selectFile = function(){
		dialog.showSaveDialog({},function (fileName) {
			$scope.new_db.path = fileName;
			$scope.$apply();
		});
	}

	$scope.saveConnect = function(){
		try{
			sqlite.connect($scope.new_db.path, $scope.new_db.password, $scope.new_db.algorithm);
			var res = sqlite.run("CREATE TABLE jayr(name TEXT)");
			if(res.error){
				console.log(res.error);
				alert("Invalid Password! Please check your password or database name.");
			}else{
				$('#modalDatabase').modal('hide');
				sqlite.run("DROP TABLE jayr");
				databaseService.addDatabase($scope.new_db);
				databaseService.connect($scope.new_db);
				$scope.$broadcast('newConnection',[]);
				$scope.$emit('change',[]);
				sqlite.close();
			}
		}catch(c){
			alert(c)
		}
	}
});