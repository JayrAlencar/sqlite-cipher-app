app.controller('convertController', function($scope) {
	const app  = require('electron');
	var sqlite = require("sqlite-cipher");
    var remote = app.remote; 
    var dialog = remote.dialog; 
	$scope.type = 1;
	$scope.convert = {};

	$scope.algorithms = sqlite.algorithms;

	$scope.selectOrigin = function(){
		dialog.showOpenDialog({},function (fileName) {
			$scope.convert.origin = fileName[0];
			$scope.$apply();
		});
	}

	$scope.selectOutput = function(){
		dialog.showSaveDialog({},function (fileName) {
			$scope.convert.output = fileName;
			$scope.$apply();
		});
	}

	$scope.startConvert = function(){
		if($scope.type == 1){
			sqlite.encrypt($scope.convert.origin,$scope.convert.output, $scope.convert.password,$scope.convert.algorithm);
		}else{
			sqlite.decrypt($scope.convert.origin,$scope.convert.output, $scope.convert.password,$scope.convert.algorithm);
		}
		dialog.showMessageBox({ message: "The file has been saved!",buttons: ["OK"],type :'info', title:"SQLite-cipher App" });
		$('#modalConvert').modal('hide')
	}
});