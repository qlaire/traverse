app.config(function($stateProvider) {
    $stateProvider.state('singleEntry', {
        url: '/entry/:entryId',
        templateUrl: 'js/singleEntry/singleEntry.html',
        controller: 'singleEntryController',
        resolve: {
          entry: function(EntriesFactory, $stateParams){
            return EntriesFactory.getEntry($stateParams.entryId);
          }
        }
    });
});

app.controller('singleEntryController', function($scope, $state, entry) {
    $scope.entry = entry;
});
