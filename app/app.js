"use strict";
var basel = require('basel-cli');
var app = angular.module('cdg',['angularUtils.directives.dirPagination', 'ace.angular','ngProgress']);
var sql_text = require('./uses/sql-text');

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

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


app.directive('resizable', function(){
  return{
    restrict: 'A',
    link: function(scope, tElement, attrs){
      console.log(tElement)
      tElement.resizable();
      tElement.addClass('ui-widget-content');
    }
  }
})

