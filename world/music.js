var songs=[];

function placeMusic(){
	var song;
	var emotion;
	var emotionList=Object.keys(emoToSongSrc);
	for(var i=0; i<emotionList.length; i++){
		emotion=emotionList[i];
		song = document.createElement("AUDIO");
		song.autoplay=true;
		song.volume=0;
		song.loop=true;
		song.src=emoToSongSrc[emotion];
		console.log(emotion);
		console.log(worldData.intenseEntries);
		song.locationOnTerrain={z: zZones[emotionToPathNum[emotion]], x: xZones[worldData.intenseEntries[emotion].chunkIndex]}
		song.associatedText=worldData.intenseEntries[emotion].body;
		songs.push(song);
	}
	console.log(songs);
}


function changeAudioVolume(worldCoords,musicCoords){
    var dx = worldCoords.x-(-500);
    var dy = worldCoords.y-86;
    var dz = worldCoords.z-164;
    var distance=Math.sqrt( dx * dx + dy * dy + dz * dz );
	var audio = songs[0];
	var metric=50/distance;
	if(metric>1){
		audio.volume=1;
	}
	else{
		audio.volume = metric;
	}
	console.log(audio.volume);
}

// function updateVolume(){
// 	console.log('updating volume')
// }