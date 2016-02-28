'use strict';

cs142App.controller('UserCommentsController', ['$scope', '$routeParams',
  function ($scope, $routeParams) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;
    $scope.models = {};
    $scope.FetchModel("/comments/" + userId + "/", function(comments){
      $scope.$apply(function(){
        $scope.models.commentList = comments;
        if (comments.length > 0){
          $scope.models.user = comments[0].user;
        }
        var firstName = $scope.models.user.first_name || "";
        var lastName = $scope.models.user.last_name || "";
        $scope.main.title = "Comments for " + firstName + " " + lastName;
        $scope.main.context = "Comments for " + firstName + " " + lastName;
      });
    });


  }]);
