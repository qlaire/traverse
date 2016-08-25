app.config(function($stateProvider) {
    $stateProvider.state('entry', {
        url: '/entry',
        templateUrl: 'js/entry/entry.html',
        controller: 'EntryController'
    });
});

app.controller('EntryController', function($scope, $log, EntryFactory, $state) {
  $scope.tinymceModel = '';
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

  $scope.postEntry = function () {
    EntryFactory.postEntry($scope.tinymceModel, $scope.title, $scope.dt)
    .then(data => {
      $state.go('entries');
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

  $scope.dt = new Date();
  $scope.today = function (){
    return new Date();
  }
  $scope.datePickerIsOpen = false;
  $scope.datePickerOpen = function () {

      this.datePickerIsOpen = true;
  };
});

app.factory('EntryFactory', function ($http) {
  let entryObj = {};
  entryObj.postEntry = function (body, title, date) {
    return $http.post('/api/entries/', {entry: body, title: title, date: date})
    .then(res => res.data);
  }
  return entryObj;
});
