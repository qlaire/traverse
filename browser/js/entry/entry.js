app.config(function($stateProvider) {
    $stateProvider.state('entry', {
        url: '/entry',
        templateUrl: 'js/entry/entry.html',
        controller: 'EntryController'
    });
});

app.controller('EntryController', function($scope, $log) {
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
            $scope.errorMessage.reg = 'Your post must contain at least a one word sentence. Sentences have punctuation!';
        }
    }
    else{
        $scope.errorMessage.length = 'Your post is too short.';
        $scope.errorMessage.reg = 'Your post must contain at least a one word sentence. Sentences have punctuation!';
    }
    return $scope.tinymceModel.length > 17 && $scope.tinymceModel.match(reg)
  }

  $scope.getContent = function() {
    console.log('Editor content:', $scope.tinymceModel);
  };

  $scope.setContent = function() {
    $scope.tinymceModel = 'Time: ' + (new Date());
  };

    $scope.tinymceOptions = {
        selector: 'div.tinymce',
        theme: 'inlite',
        plugins: 'autoresize',
        autoresize_max_height:500,
        selection_toolbar: 'bold italic underline strikethrough | blockquote',
        inline: true,
        paste_data_images: false
    };
});

app.factory('EntryFactory', function ($http) {
  let entryObj = {};
  entryObj.analyzeEntry = function (entry) {

  }
  return entryObj;
});
