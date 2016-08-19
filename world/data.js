window.addEventListener("message", receiveMessage, false);

var worldData={
	keywords: [],
	emoScores: []
}

function receiveMessage(event){
    worldData=event.data;
    console.log(worldData);
}

