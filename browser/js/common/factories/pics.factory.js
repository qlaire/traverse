app.factory('PicsFactory', function($http, $log) {
  var PicsFactory = {};

  function getData (response) {
    return response.data;
  }

  PicsFactory.getAll = function () {
      return $http.get('/api/pics')
      .then(getData)
      .then(function(pics){
        return pics;
      })
    }

    PicsFactory.getPic = function (id) {
      return $http.get('/api/pics/' + id)
      .then(getData)
      .then(function(pic){
        return pic;
      })
    }

    PicsFactory.postPic = function(pic){
      $log.log("posting pic");
      return $http.post('/api/pics', pic)
    }

  return PicsFactory;
});
