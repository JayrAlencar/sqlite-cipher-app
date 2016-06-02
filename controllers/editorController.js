"use strict";
app.controller("editorController", function($scope, databaseService){
	ace.require("ace/ext/language_tools");
	var editor = ace.edit("editor");
	editor.session.setMode("ace/mode/sql");
	editor.setTheme("ace/theme/tomorrow");
    // enable autocompletion and snippets
    editor.setOptions({
    	enableBasicAutocompletion: true,
    	enableSnippets: true,
    	enableLiveAutocompletion: false,
    	autoScrollEditorIntoView: true,
    });

    const app  = require('electron');

    var remote = app.remote; 
    var dialog = remote.dialog; 
    var globalShortcut = remote.globalShortcut;
    var win = app.remote.getCurrentWindow();

    function sizes(){
    	var total = $('.all').height();
    	if(total == 0){
    		total = (win.getSize()[1])-200;
    	}
    	console.log(total)
    	var mid = total/2;
    	$('.mid').height(mid);
    }

    win.on("resize", function(r){
	  sizes();
	});
	

    var fs = require("fs");

    $scope.init = function(){
    	databaseService.getConnecteds(function(res){
    		$scope.databases = res;
    	});
    	sizes();
    }

    $scope.results = [];

    $scope.run = function(){
    	$scope.editorContent = editor.getSession().getValue();
    	if($scope.connection){
    		$scope.results = [];
    		var sql = $("<div>"+$scope.editorContent+"</div>").text();

    		var sqls = sql.split(';');


    		for(var i in sqls){
    			if(sqls[i] && sqls[i] != ''){
    				executing(sqls[i]);	
    			}

    		}
    	}else{
    		dialog.showErrorBox("Error", "Please connect in a database");
    	}
    }

    $scope.modifyContent = function(){
		// console.log($scope.editorContent)
	}

	$scope.$on('newConnection', function(event, args) {
		$scope.init();
	})

	function executing(sql){
		console.log(sql)
		var sqlite = require("sqlite-cipher");
		sqlite.connect($scope.connection.path, $scope.connection.password, $scope.connection.algorithm);
		var type = sql.substring(0,6);
		type = type.toUpperCase();
		sqlite.run(sql, function(res){
			console.log(res)
			if(res.error){
				$scope.results.push({type:"alert",class:"alert-danger",message:res.error.message+"<br>"+sql});
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

	$scope.save = function(){
		dialog.showSaveDialog(function (fileName) {
			$scope.editorContent = editor.getSession().getValue();
			var sql = $("<div>"+$scope.editorContent+"</div>").text();
			fs.writeFile(fileName, sql, function(err){
				dialog.showMessageBox({ message: "The file has been saved!",buttons: ["OK"],type :'info', title:"SQLite-cipher App" });
			});
		}); 
	}

	globalShortcut.register('F9', () => {
		$scope.run();
		$scope.$apply();
	});

	globalShortcut.register('CommandOrControl+S', () => {
		$scope.save();
	});

});