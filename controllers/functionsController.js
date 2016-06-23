'use strict';
app.controller('functionsController', function($scope,databaseService){
	$scope.aceOption = {
    	mode: 'javascript',
    	require: ['ace/ext/language_tools'],
    	advanced: {
    		enableSnippets: true,
    		enableBasicAutocompletion: true,
    		enableLiveAutocompletion: true
    	},
    	onLoad: function(editor, session, ace){
    		$scope.langTools = ace.require('ace/ext/language_tools');
    		$scope.editor = editor;
    		$scope.session = session;
    		session.on('change',function(){
    			$scope.function.function = session.getValue();
    		});
    	}
    };
    $scope.$on('databaseFun', function(e, args){
    	$scope.database = args;
    	$scope.getFunctions();
    });
    $scope.getFunctions = function(){
    	databaseService.getFunctions($scope.database.id, function(data){
    		$scope.functions = data;
    	})
    }
    $scope.editFunction = function(data){
    	$scope.function = data;
    	$scope.session.setValue($scope.function.function);
    }
    $scope.saveFunction = function(){
    	if($scope.function.id){
    		$scope.function.function = $scope.session.getValue();
    		databaseService.editFunction($scope.function, function(res){
    			$scope.getFunctions();
    			$scope.session.setValue('');
    		});

    	}else{
    		$scope.function.id_database = $scope.database.id;
    		databaseService.addFunction($scope.function, function(res){
    			 $scope.getFunctions();
    		});
    	}
    	$scope.function = {};
    }
    $scope.deleteFunction = function(data){
    	if(confirm("Are you sure?")){
    		databaseService.deleteFunction(data.id, function(r){
    			$scope.getFunctions();
    		});
    	}
    }
});