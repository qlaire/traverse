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

app.controller('EntriesCtrl', function($scope, allEntries, $state, EntryFactory, $log) {
  $scope.entries = allEntries;

  $scope.analyzed = EntryFactory.watsonAnalyzed;

  $scope.retrySuccess = [];

  $scope.retryFailed = [];

  $scope.tryAnalysis = function (id) {
      EntryFactory.tryAnalysis(id)
      .then(res => {
          if (res.status === 201) {
            $scope.retrySuccess.push(id);
          } else if (res.status === 206) {
            $scope.retryFailed.push(id);
          }
      })
      .catch($log.error);
  }

  $scope.goEntry = function (entry){
        $state.go('singleEntry', {entryId: entry.id});
    }
});
