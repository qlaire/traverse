app.factory('EntriesFactory', function($http, $log, Session) {
  var EntriesFactory = {};

  function getData (response) {
    return response.data;
  }

  EntriesFactory.getAll = function () {
      return $http.get('/api/entries')
      .then(getData)
    }

  return EntriesFactory;
});
