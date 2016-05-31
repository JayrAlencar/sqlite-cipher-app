"use strict";
app.controller("editorController", function($scope, databaseService){
	$scope.init = function(){
		databaseService.getConnecteds(function(res){
			$scope.databases = res;
		});
	}

	$scope.results = [];

	$scope.run = function(){
		$scope.results = [];
		var sql = $("<div>"+$scope.editorContent+"</div>").text();

		var sqls = sql.split(';');


		for(var i in sqls){
			if(sqls[i] && sqls[i] != ''){
				executing(sqls[i]);	
			}
			
		}

	}

	$scope.$on('newConnection', function(event, args) {
		$scope.init();
	})

	function executing(sql){
		var sqlite = require("sqlite-cipher");
		sqlite.connect($scope.connection.path, $scope.connection.password, $scope.connection.algorithm);
		var type = sql.substring(0,6);
		type = type.toUpperCase();
		sqlite.run(sql, function(res){
			console.log(res)
			if(res.error){
				$scope.results.push({type:"alert",class:"alert-danger",message:res.error.message});
			}else{
				switch(type){
					case "INSERT":
						$scope.results.push({type:"alert",class:"alert-success",message:"Success - insert id: "+res});
						break;
					case "UPDATE":
						$scope.results.push({type:"alert",class:"alert-success",message:"Success - Affected rows: "+res});
						break;
					case "DELETE":
						$scope.results.push({type:"alert",class:"alert-success",message:"Success - Affected rows: "+res});
						break;
					case "SELECT":
							$scope.results.push({type:"table",rows:res, fields:fields(res)});
						break;
					case "CREATE":
						$scope.results.push({type:"alert",class:"alert-success",message:"Success!"});
						break;
				}
				$scope.$emit("change");
			}

		});
	}

	function fields(data){
		var row = data[0];
		return Object.keys(row);
	}
});