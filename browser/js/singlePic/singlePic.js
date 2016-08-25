app.config(function($stateProvider) {
    $stateProvider.state('singlePic', {
        url: '/pic/:picId',
        templateUrl: 'js/singlePic/singlePic.html',
        controller: 'singlePicController',
        data: {
            bodyClass: 'bg4'
        },
        resolve: {
          pic: function(PicsFactory, $stateParams){
            return PicsFactory.getPic($stateParams.picId);
          }
        }
    });
});

app.controller('singlePicController', function($scope, $state, pic) {
    $scope.pic = pic;
});
