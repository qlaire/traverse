app.config(function($stateProvider) {
    $stateProvider.state('editEntry', {
        url: '/entry/edit/:id',
        templateUrl: 'js/editEntry/editEntry.html',
        controller: 'EditEntryController',
        resolve: {
          entry: function(EntriesFactory, $stateParams){
            return EntriesFactory.getEntry($stateParams.id);
          }
        }
    });
});

app.controller('EditEntryController', function(entry, $scope, $log, EditEntryFactory, $state) {
  $scope.tinymceModel = entry.body;
  $scope.title = entry.title
  $scope.dt = entry.date
  $scope.errorMessage = {};

  var reg = /[^.!?]*[.!?]/gi;

  $scope.validate = function (){

    if($scope.tinymceModel){
        if($scope.tinymceModel.length < 17){
            $scope.errorMessage.length = 'Your post is too short.';
        } else {
            $scope.errorMessage.length = '';
        }

        if($scope.tinymceModel.match(reg)){
            $scope.errorMessage.reg = '';
        } else {
            $scope.errorMessage.reg = 'Your post must contain at least a one sentence. Sentences have punctuation!';
        }
    }
    else{
        $scope.errorMessage.length = 'Your post is too short.';
        $scope.errorMessage.reg = 'Your post must contain at least a one sentence. Sentences have punctuation!';
    }
    return $scope.tinymceModel.length > 17 && $scope.tinymceModel.match(reg)
  }

  $scope.updateEntry = function () {
    EditEntryFactory.updateEntry(entry.id, $scope.tinymceModel, $scope.title, $scope.dt)
    .then(data => {
      $state.go('singleEntry', {entryId: entry.id});
    })
    .catch($log.error);
  }

  $scope.tinymceOptions = {
      selector: 'div.tinymce',
      theme: 'inlite',
      plugins: 'autoresize',
      autoresize_max_height:500,
      selection_toolbar: 'bold italic underline strikethrough | blockquote',
      inline: true,
      paste_data_images: false
  };

  $scope.today = new Date();
  $scope.datePickerIsOpen = false;
  $scope.datePickerOpen = function () {

      this.datePickerIsOpen = true;
  };
});

app.factory('EditEntryFactory', function ($http) {
  let entryObj = {};
  entryObj.updateEntry = function (id, body, title, date) {
    return $http.put('/api/entries/' + id, {entry: body, title: title, date: date})
    .then(res => res.data);
  }
  return entryObj;
});
