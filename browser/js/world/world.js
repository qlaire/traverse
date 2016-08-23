app.config(function ($stateProvider) {
	$stateProvider.state('world', {
		url: '/world?mode',
		templateUrl: 'js/world/world-template.html',
		controller: 'WorldCtrl'
	});
})

app.controller('WorldCtrl', function ($scope, DataFactory,$stateParams) {
	if($stateParams.mode==='demo'){
		$scope.worldData=DataFactory.getDemoData();
	}
	else{
		DataFactory.getWorldData()
		.then(function(returnedData){
			$scope.worldData=returnedData;
		})		
	}
	var worldWindow=worldFrame.contentWindow;
    worldFrame.onload = function(){
        worldWindow.postMessage($scope.worldData,'/')    
    };
});

