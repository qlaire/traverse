app.config(function ($stateProvider) {
    $stateProvider.state('entry', {
        url: '/entry',
        templateUrl: 'js/entry/entry.html',
        controller: 'TinyMceController'
    });
});

app.controller('TinyMceController', function($scope) {
  $scope.tinymceModel = 'Dear Diary,';

  $scope.getContent = function() {
    console.log('Editor content:', $scope.tinymceModel);
  };

  // $scope.setContent = function() {
  //   $scope.tinymceModel = 'Time: ' + (new Date());
  // };

  // $scope.submitEntry = function() {
  // };

  // $scope.tinymceOptions = {
  //   plugins: 'link code',
  //   themes: 'inlite',
  //   toolbar: 'undo redo | bold italic underline strikethrough | alignleft aligncenter alignright | code'
  // };
});
