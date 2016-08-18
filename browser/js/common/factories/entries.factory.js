app.factory('EntriesFactory', function($http) {

   function getData (response) {
    return response.data;
  }

  function getAllEntries (){
    $http.get('/api/entries')
    .then(getData)
  }

  return {
    getAllEntries: getAllEntries,
  };
});
