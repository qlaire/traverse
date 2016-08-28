app.directive('footer', function($rootScope, AuthService, AUTH_EVENTS, $state) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/footer/footer.html',
        link: function(scope) {

            scope.loggedOutitems = [{
                label: 'ABOUT',
                state: 'about'
            }, {
                label: 'DEMOS',
                state: 'demos'
            }, {
                label: 'LOGIN',
                state: 'login'
            }, {
                label: 'SIGNUP',
                state: 'signup'
            }];

            scope.loggedInItems = [{
                label: 'ABOUT',
                state: 'about'
            }, {
                label: 'NEW ENTRY',
                state: 'entry'
            }, {
                label: 'YOUR JOURNAL',
                state: 'entries'
            }, {
                label: 'YOUR WORLD',
                state: 'world'
            }];

            scope.user = null;

            scope.isLoggedIn = function() {
                return AuthService.isAuthenticated();
            };

            scope.logout = function() {
                AuthService.logout().then(function() {
                    $state.go('home');
                });
            };

            var setUser = function() {
                AuthService.getLoggedInUser().then(function(user) {
                    scope.user = user;
                });
            };

            var removeUser = function() {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});
