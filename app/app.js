"use strict";
var basel = require('basel-cli');
var app = angular.module('cdg',['angularUtils.directives.dirPagination', 'ace.angular']);
var sql_text = require('./uses/sql-text');

app.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeFunc = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeFunc);
    }
  };
});

app.directive('myController', function() {
    return {
        restrict: 'A',
        link: function(scope, tElement, attrs) {
          scope.$watch(attrs.myController, function(ctrlName) {
            var div = tElement;
            div.attr('ng-controller',scope.$eval(ctrlName));
          });
        }
    }
});

function test($scope){
  $scope.message = "Scope test"
}