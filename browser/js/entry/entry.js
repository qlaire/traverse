app.config(function($stateProvider) {
    $stateProvider.state('entry', {
        url: '/entry',
        templateUrl: 'js/entry/entry.html',
        controller: 'TinyMceController',
        data: {
            bodyClass: 'bg4'
        }
    });
});

app.controller('TinyMceController', function($scope) {
    $scope.tinymceModel = 'How are you feeling today?';

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
