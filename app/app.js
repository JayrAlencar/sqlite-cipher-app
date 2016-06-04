"use strict";
var basel = require('basel-cli');
var app = angular.module('cdg',['angularUtils.directives.dirPagination']);
var sql_text = require('./uses/sql-text');

app.directive('contenteditable', function() {
  return {
      restrict: 'A', // only activate on element attribute
      require: '?ngModel', // get a hold of NgModelController
      link: function(scope, element, attrs, ngModel) {
        if(!ngModel) return; // do nothing if no ng-model

        // Specify how UI should be updated
        ngModel.$render = function() {
          element.html(ngModel.$viewValue || '');
        };

        // Listen for change events to enable binding
        element.on('blur keyup change', function() {
          scope.$apply(read);
        });
        read(); // initialize

        // Write data to the model
        function read() {
          var html = element.html();
          // When we clear the content editable the browser leaves a <br> behind
          // If strip-br attribute is provided then we strip this out
          if( attrs.stripBr && html == '<br>' ) {
            html = '';
          }

          var reservedWords = sql_text.reserved;
          ngModel.$setViewValue(html);
        }
      }
    };
  });

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
            div.attr('ng-controller',ctrlName);
          });
        }
    }
});

function test($scope){
  $scope.message = "Scope test"
}