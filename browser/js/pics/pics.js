app.config(function ($stateProvider) {
    $stateProvider.state('pics', {
        url: '/pics',
        templateUrl: 'js/pics/pics.html',
        controller: 'PicsCtrl',
        resolve: {
          allPics: function(PicsFactory){
            return PicsFactory.getAll();
          }
        }
    });
});

app.controller('PicsCtrl', function($scope, allPics, $state) {
  $scope.pics = allPics;

  $scope.goPic = function (pic){
        $state.go('singlePic', {picId: pic.id});
    }
});
