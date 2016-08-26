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

  $scope.retryAttempted = false;

  $scope.retrySuccess;

  $scope.tryAnalysis = function (id, title, body) {
      EntryFactory.tryAnalysis(id, title, body)
      .then(res => {
          if (res.status === 200) {
              $scope.retrySuccess = true;
          } else if (res.status === 206) {
              $scope.retrySuccess = false;
          }
      })
      .catch($log.error);
  }

  $scope.goEntry = function (entry){
        $state.go('singleEntry', {entryId: entry.id});
    }
});
