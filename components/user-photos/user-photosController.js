'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$routeParams','$location',
  function($scope, $routeParams, $location) {
    /*
     * Since the route is specified as '/photos/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;


    $scope.models = {};
    $scope.models.photos = [];
      $scope.FetchModel("/photosOfUser/" + userId + "/", function(photos){
        console.log(photos);
        var photosNum = photos.length;
        $scope.$apply(function(){
          $scope.models.photos = photos;
          if (photos.length > 0){
            $scope.models.user = photos[0].user;
          }
          var firstName = $scope.models.user.first_name || "";
          var lastName = $scope.models.user.last_name || "";
          $scope.main.title = firstName + " " + lastName + " Photos";
          $scope.main.context = "Photos for " + firstName + " " + lastName;
        });

      });
  }]);
