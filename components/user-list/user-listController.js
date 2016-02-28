'use strict';


cs142App.controller('UserListController', ['$scope',
    function ($scope) {
        $scope.main.title = 'Users';
        $scope.main.context = "Users";
        $scope.models = {};
        $scope.FetchModel("/user/list/", function(users){
          $scope.$apply(function(){
            $scope.models.userList = users;
          });
        });
    }]);
