window.addEventListener("message", receiveMessage, false);

var worldData={
	keywords: [],
	emoScores: []
}

//CHANGE TO OPEN SOURCE SONGS!!!!
var emoToSongSrc={'anger':'assets/Greater_Than_Or_Equal_To_-_01_-_Silent_Treatment.mp3',
					'joy':'assets/bensound-ukulele.mp3',
					'sadness':'assets/Kai_Engel_-_04_-_Moonlight_Reprise.mp3',
					'fear':'assets/Lee_Rosevere_-_10_-_Nightfall.mp3'}

var emotionToPathNum= {
	'anger':0,
	'joy':1,
	'fear':2,
	'sadness':1
}

var emotionToColor={
	'anger':'#A8263F',
	'joy':'#FDAA43',
	'fear':'#x3B3F78',
	'sadness':'#7bbdec'
}
function receiveMessage(event){
    worldData=event.data;
    saveEmoScores(worldData);
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