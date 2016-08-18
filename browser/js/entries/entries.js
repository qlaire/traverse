app.config(function ($stateProvider) {
    $stateProvider.state('entries', {
        url: '/entries',
        templateUrl: 'js/entries/entries.html',
        controller: 'EntriesCtrl'
    });
});

app.controller('EntriesCtrl', function($scope, EntriesFactory) {
  $scope.entries = EntriesFactory.getAllEntries();
});
