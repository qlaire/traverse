app.config(function ($stateProvider) {
  $stateProvider.state('journalEntry', {
    url: '/new-entry',
    templateUrl: 'js/journal-entry/journal-entry.html'
  });
});

app.controller('EntryCtrl', function ($scope) {
  
});

app.factory('EntryFactory', function ($http) {
  let entryObj = {};
  entryObj.analyzeEntry = function (entry) {
    
  }
  return entryObj;
});