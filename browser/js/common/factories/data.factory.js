app.factory('DataFactory', function($http, $log, Session) {
  var DataFactory = {};

  function getData (response) {
  	console.log('here i am')
  	console.log(response);
    return response.data;
  }
  DataFactory.getWorldData = function () {
  	  console.log('HERE I AM')
      return $http.get('/api/users/data')
      .then(getData)
    }
  return DataFactory;
});
