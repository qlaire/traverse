app.factory('EntriesFactory', function($http, $log) {
  var EntriesFactory = {};

  function getData (response) {
    return response.data;
  }

  function entryFormat(entry){

    entry.snippet = entry.body.substr(0,200);

    if(entry.snippet.length < entry.body.length){
      entry.snippet += '...';
    }

    entry.date = entry.date.substr(0, 10);
  }

  EntriesFactory.getAll = function () {
      return $http.get('/api/entries')
      .then(getData)
      .then(function(entries){
        entries.forEach(entryFormat);
        return entries;
      })
    }

    EntriesFactory.getEntry = function (id) {
      return $http.get('/api/entries/' + id)
      .then(getData)
      .then(function(entry){
        entryFormat(entry);
        return entry;
      })
    }



  return EntriesFactory;
});
