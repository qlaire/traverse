/*Listen for event from /world page, in which world.html is nested as an iframe*/
window.addEventListener("message", receiveMessage, false);

/*A series of dictionaries mapping emotions to resources or values*/
var emoToSongSrc={'anger':'assets/The Mountain Goats - This Year.mp3',
					'joy':'assets/Sigur Ros - Gobbledigook.mp3',
					'sadness':'assets/NADLER, Marissa - Diamond Heart.mp3',
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

/*When the iframe receives a message, this function saves the incoming data into worldData.
It then initialize the scene and runs the animation loop.*/
function receiveMessage(event){
    worldData=event.data;
    saveEmoScores(worldData);
    init();
	animate();
}

/*
	emoScores is a 2d array representing the emotional scores on each path, over time. For example:
	[
		[1,.5,1], //anger (over time)
		[0,.6,.2], //joy (over time)
		[.5,1,0] //fear (over time)
	]
	Since this array is later mutated, we save a copy for later access
*/
saveEmoScores=function(worldData){
	worldData.originalEmoScores=[];
	for(var i=0; i<worldData.emoScores.length; i++){
		worldData.originalEmoScores[i]=[];
		for(var j=0; j<worldData.emoScores[0].length; j++){
			worldData.originalEmoScores[i].push(worldData.emoScores[i][j]);
		}
	}
}