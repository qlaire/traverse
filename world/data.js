window.addEventListener("message", receiveMessage, false);

var worldData={
	keywords: [],
	emoScores: []
}

function receiveMessage(event){
    worldData=event.data;
    saveEmoScores(worldData);
    console.log(worldData);
    init();
	animate();
}

saveEmoScores=function(worldData){
	worldData.originalEmoScores=[];
	for(var i=0;i<worldData.emoScores.length;i++){
		worldData.originalEmoScores[i]=[];
		for(var j=0;j<worldData.emoScores[0].length;j++){
			worldData.originalEmoScores[i].push(worldData.emoScores[i][j]);
		}
	}
}