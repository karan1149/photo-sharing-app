'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$routeParams','$location',
  function($scope, $routeParams, $location) {
    /*
     * Since the route is specified as '/photos/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;

    // get a valid photoNum
    $scope.photoNum = 0;
    if (Number($routeParams.photoNum) >= 0){
      $scope.main.advanced = true;
    }
    if ($scope.main.advanced){
        $scope.photoNum = Number($routeParams.photoNum);
    }
    if (isNaN($scope.photoNum)){
      $scope.photoNum = 0;
    }
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
          $scope.firstPhoto = $scope.photoNum === 0;
          $scope.lastPhoto = $scope.photoNum === photosNum - 1;
        });
        $scope.$watch('main.advanced', function(){
            // set photos set to appropriate photo and return to full set if appropriate
            if ($scope.main.advanced){
              console.log($scope.photoNum);
              $scope.models.photos = $scope.models.photos.slice($scope.photoNum, $scope.photoNum + 1);
            } else {
              $scope.models.photos = $scope.models.photos;
            }
        });
      });

      $scope.$watch('main.advanced', function(){
          // set photos set to appropriate photo and return to full set if appropriate
          if ($scope.main.advanced){
            console.log($scope.photoNum);
            $scope.models.photos = $scope.models.photos.slice($scope.photoNum, $scope.photoNum + 1);
          } else {
            $scope.models.photos = $scope.models.photos;
          }
      });
  }]);
