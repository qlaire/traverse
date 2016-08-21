var songs=[];

//remove
var emotionsToColors={'sadness':'blue','fear':'purple','anger':'red','joy':'orange'}
function placeMusic(){
	var song;
	var emotion;
	var emotionList=Object.keys(emoToSongSrc);
	for(var i=0; i<emotionList.length; i++){
		emotion=emotionList[i];
		song = document.createElement("AUDIO");
		song.emotion=emotion;
		song.autoplay=true;
		song.volume=0;
		song.loop=true;
		song.src=emoToSongSrc[emotion];
		console.log(emotion);
		console.log(worldData.intenseEntries);
		song.locationOnTerrain={z: zZones[emotionToPathNum[emotion]], x: xZones[worldData.intenseEntries[emotion].chunkIndex]}
		song.associatedText=worldData.intenseEntries[emotion].body;
		songs.push(song);
		//REMOVE AND REMOVE DICT ABOVE!!
		var geometry = new THREE.SphereGeometry( 50, 32, 32 );
		var material = new THREE.MeshBasicMaterial( {color: emotionsToColors[emotion]} );
		var sphere = new THREE.Mesh( geometry, material );
		sphere.position.x=song.locationOnTerrain.x;
		sphere.position.y=200;
		sphere.position.z=song.locationOnTerrain.z;
		scene.add( sphere );
	}
}


function changeAudioVolume(worldCoords){
	var song, dx, dz, distance, audio, metric;
	var volumes={};
	console.log(songs);
	for(var i=0;i<songs.length;i++){
		song=songs[i];
		console.log(song);
	    dx = worldCoords.x-(song.locationOnTerrain.x);
	    //var dy = worldCoords.y-86;
	    dz = worldCoords.z-(song.locationOnTerrain.z);
	    distance=Math.sqrt( dx * dx /*+ dy * dy*/ + dz * dz );
		// audio = song.audio;
		var metric=3/distance;
		if(metric>1){
			song.volume=1;
		}
		else{
			song.volume = metric;
		}
		volumes[song.emotion]=song.volume;
	}
	//arbitrate conflicts
	emphasizeLoudest(volumes,songs);

}

function emphasizeLoudest(volumes,songs){
	var maxVol=0;
	var maxVolIndex=-1;
	var emoList=Object.keys(volumes);
	for(var i=0;i<emoList.length;i++){
		if(volumes[emoList[i]]>maxVol){
			maxVol=volumes[i];
			maxVolIndex=i;
		}
	}
	for(var i=0;i<songs;i++){
		if(i!==maxVolIndex){
			songs[i].volume=songs[i].volume*.01;
		}
	}

}

// function updateVolume(){
// 	console.log('updating volume')
// }