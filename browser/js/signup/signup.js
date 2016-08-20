app.config(function ($stateProvider) {
    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/signup/signup.html',
        controller: 'SignupCtrl',
        data: {
            bodyClass: 'bg3'
        }
    });
});

app.controller('SignupCtrl', function($scope, AuthFactory, $state, AuthService) {
  $scope.sendSignup = function(info) {
    console.log('info', info);
    AuthFactory.signup($scope.signup)
    .then(function() {
      return AuthService.login(info)
    })
    .then(function() {
      $state.go('entries');
    });
  }
});

app.factory('AuthFactory', function($http, $state) {
  var authObj = {};

  authObj.currentUser = {};
  authObj.currentUser.loggedIn = false;

  authObj.signup = function(data) {
    return $http.post('/api/users', data)
      // .catch($log.error);
  };

  authObj.isLoggedIn = function() {
    return authObj.currentUser.loggedIn;
  };

  return authObj;
});
