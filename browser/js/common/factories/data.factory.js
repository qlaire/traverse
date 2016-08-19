app.factory('DataFactory', function($http, $log, Session) {
  var DataFactory = {};

  function getData (response) {
    return response.data;
  }
  DataFactory.getWorldData = function () {
      return $http.get('/api/users/data')
      .then(getData)
    }
  return DataFactory;
});
