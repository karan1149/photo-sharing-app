'use strict';

var cs142App = angular.module('cs142App', ['ngRoute', 'ngMaterial']);

cs142App.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/users', {
                templateUrl: 'components/user-list/user-listTemplate.html',
                controller: 'UserListController'
            }).
            when('/users/:userId', {
                templateUrl: 'components/user-detail/user-detailTemplate.html',
                controller: 'UserDetailController'
            }).
            when('/photos/:userId', {
                templateUrl: 'components/user-photos/user-photosTemplate.html',
                controller: 'UserPhotosController'
            }).
            when('/photos/:userId/:photoNum', {
                templateUrl: 'components/user-photos/user-photosTemplate.html',
                controller: 'UserPhotosController'
            }).
            when('/comments/:userId', {
                templateUrl: 'components/user-comments/user-commentsTemplate.html',
                controller: 'UserCommentsController'
            }).
            otherwise({
                redirectTo: '/users'
            });
    }]);

cs142App.controller('MainController', ['$scope',
    function ($scope) {
        $scope.main = {};
        $scope.main.title = {title: 'Users'};
        $scope.main.context = "Users";
        $scope.main.advanced = false;
        $scope.main.version = 0;
       $scope.FetchModel = function(url, doneCallback) {
         var xhr = new XMLHttpRequest();
         xhr.onreadystatechange = function(){
           if (this.readyState !== 4) { return; }
           if (this.status !== 200) { console.log("Error!", this.status); return; }
           doneCallback(JSON.parse(this.responseText));
         };
         xhr.open("GET", url);
         xhr.send();
       };
       $scope.FetchModel("http://localhost:3000/test/info", function(model){
         $scope.$apply(function(){
           $scope.main.version = model.version;
         });
       });
          }]);
