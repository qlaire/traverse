app.config(function ($stateProvider) {
    $stateProvider.state('entries', {
        url: '/entries',
        templateUrl: 'js/entries/entries.html',
        controller: 'EntriesCtrl'
    });
});