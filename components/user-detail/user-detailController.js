'use strict';

cs142App.controller('UserDetailController', ['$scope', '$routeParams',
  function ($scope, $routeParams) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;
    $scope.models = {};
    $scope.models.user = {};
    $scope.FetchModel("/user/" + userId + "/", function(user){
      $scope.$apply(function(){
        $scope.models.user = user;
        $scope.main.title = $scope.models.user.first_name + " " + $scope.models.user.last_name;
        $scope.main.context = "Profile for " + $scope.models.user.first_name + " " + $scope.models.user.last_name;
      });
    });


  }]);
