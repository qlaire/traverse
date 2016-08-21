window.addEventListener("message", receiveMessage, false);

var worldData={
	keywords: [],
	emoScores: []
}

//CHANGE TO OPEN SOURCE SONGS!!!!
var emoToSongSrc={'anger':'assets/The Mountain Goats - This Year.mp3',
					'joy':'assets/Sigur Ròs - Gobbledigook.mp3',
					'sadness':'assets/NADLER, Marissa - Diamond Heart.mp3',
					'fear':'assets/Weirdomusic_-_03_-_Very_Scary_Part_2'}

var emotionToPathNum= {
	'anger':0,
	'joy':1,
	'fear':2,
	'sadness':1
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