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
		//NOT SURE WHY THIS TRANSLATION IS NECESSARY, MAKE CONSISTENT
		// song.locationOnTerrain={x: xZones[worldData.intenseEntries[emotion].chunkIndex],z: -zZones[emotionToPathNum[emotion]]}
		song.locationOnTerrain={x: xZones[worldData.intenseEntries[emotion].chunkIndex],z: randomXInEmotion(emotion),y:0}

		// console.log(song.emotion,song.locationOnTerrain)

		song.associatedText=worldData.intenseEntries[emotion].body;
		songs.push(song);
		//REMOVE AND REMOVE DICT ABOVE!!
		// var geometry = new THREE.SphereGeometry( 50, 32, 32 );
		// var material = new THREE.MeshBasicMaterial( {color: emotionsToColors[emotion]} );
		// var sphere = new THREE.Mesh( geometry, material );
		// sphere.position.x=song.locationOnTerrain.x;
		// sphere.position.z=song.locationOnTerrain.z;
		// sphere.position.y=200;
		// scene.add( sphere );
	}
}


function changeAudioVolume(localCoords){
	//console.log(worldCoords);
	var worldCoords=terrain.localToWorld(localCoords);
	//console.log(terrain.worldToLocal(worldCoords));
	var song, dx, dz, distance, audio, metric;
	var distances={}
	for(var i=0;i<songs.length;i++){
		song=songs[i];
	    dx = worldCoords.x-(song.locationOnTerrain.x);
	    //var dy = worldCoords.y-86;
	    dz = worldCoords.z-(song.locationOnTerrain.z);

	    distance=Math.sqrt( dx * dx /*+ dy * dy*/ + dz * dz );
	    // console.log(song.emotion,distance);
	    // if(distance<=60){
	    // 	var printLocation={};
	    // 	printLocation.x=song.locationOnTerrain.x;
	    // 	printLocation.z=song.locationOnTerrain.z;
	    // 	printLocation.y=localCoords.y;
	    // 	printEntry(song.emotion,printLocation);
	    // }
		// audio = song.audio;
		var metric=10/distance;
		if(metric>1){
			song.volume=1;
		}
		else{
			song.volume = metric;
		}
		distances[song.emotion]=distance;
	}
	emphasizeLoudest(distances,songs);

}

function emphasizeLoudest(distances,songs){
	var minDist=Infinity;
	var minDistEmo=null;
	var emoList=Object.keys(distances);
	// console.log('volumes',volumes);
	for(var i=0;i<emoList.length;i++){
		if(distances[emoList[i]]<minDist){
			minDist=distances[emoList[i]];
			minDistEmo=emoList[i];
		}
	}
	for(var i=0;i<songs.length;i++){
		var song=songs[i];
		if(song.emotion!==minDistEmo){
			song.volume*=0.2;
		}
	}

}

// function printEntry(emotion,location){
// 	if(worldData.intenseEntries[emotion].complete===true){
// 		return;
// 	}
// 	console.log('DOING IT')
// 	worldData.intenseEntries[emotion].complete=true;
// 	var entryToPrint=worldData.intenseEntries[emotion].body;
// 	var sentences=entryToPrint.split('. ');
// 	console.log(sentences)
// 	var sentenceMesh;
// 	for(var i=0;i<sentences.length;i++){
// 		sentenceMesh=placeASentence(sentences[i],location);
// 	}
// }

// function updateVolume(){
// 	console.log('updating volume')
// }