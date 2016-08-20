app.config(function ($stateProvider) {
    $stateProvider.state('entries', {
        url: '/entries',
        templateUrl: 'js/entries/entries.html',
        controller: 'EntriesCtrl',
        resolve: {
          allEntries: function(EntriesFactory){
            return EntriesFactory.getAll();
          }
        }
    });
});

app.controller('EntriesCtrl', function($scope, allEntries, $state) {
  $scope.entries = allEntries;

  $scope.goEntry = function (entry){
        $state.go('singleEntry', {entry: entry});
    }
});
