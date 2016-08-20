app.config(function($stateProvider) {
    $stateProvider.state('entry', {
        url: '/entry',
        templateUrl: 'js/entry/entry.html',
        controller: 'EntryController'
    });
});

app.controller('EntryController', function($scope) {
    $scope.entry = {};
    
    $scope.entry.body = '';

    $scope.reg = /\s+[^.!?]*[.!?]/;

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
