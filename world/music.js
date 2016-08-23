var songs=[];


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
		song.leftEarth=false;
		song.src=emoToSongSrc[emotion];
		//NOT SURE WHY THIS TRANSLATION IS NECESSARY, MAKE CONSISTENT
		var location={x: xZones[worldData.intenseEntries[emotion].chunkIndex],z: randomXInEmotion(emotion),y:-60}
		song.entryMesh=createEntryBall(emotion,location);
		song.associatedText=worldData.intenseEntries[emotion].body;
		songs.push(song);
		var disk=placeDisk(location.x,location.z,100,'wordBall')
		disk.associatedBall=song.entryMesh;

	}
}

// var localVec=new THREE.Vector3(0,0,0);

function changeAudioVolume(worldCoords,onPlane){
	//I do NOT understand why this is necessary - should already be world coords. look into this!!
	// var worldCoords=terrain.localToWorld(localVec.copy(localCoords));
	var song, dx, dz, distance, audio, metric, distanceFlat;
	var distances={}
	for(var i=0; i<songs.length; i++){
		song=songs[i];
	    dx = worldCoords.x-(song.entryMesh.position.x);
	    dz = worldCoords.z-(song.entryMesh.position.z);
	    if(onPlane){
	    	worldCoords.y=planeHeight;
	    }
	    dy = worldCoords.y-(song.entryMesh.position.y);
	    distance=Math.sqrt( dx * dx + dy * dy + dz * dz );
	    distanceFlat=Math.sqrt( dx * dx + dz * dz );
	    if(!song.entryMesh.rising&&!onPlane){
	    	distance=distanceFlat;
	    }
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
	for(var i=0; i<emoList.length; i++){
		if(distances[emoList[i]]<minDist){
			minDist=distances[emoList[i]];
			minDistEmo=emoList[i];
		}
	}
	for(var i=0; i<songs.length; i++){
		var song=songs[i];
		if(song.emotion!==minDistEmo){
			song.volume*=0.2;
		}
	}

}

function silenceMusic(){
	console.log('im here...');
	for(var i=0; i<songs.length; i++){
		songs[i].volume=0;
	}
}


var entryMeshes=[];
function createEntryBall(emotion,location){
	if(worldData.intenseEntries[emotion].complete===true){
		return;
	}
	worldData.intenseEntries[emotion].complete=true;
	return createEntryBallMesh(emotion,location);
}

function createEntryBallMesh(emotion,location){
    var canvas=generateDiaryCanvas(emotion,location);
	var texture1 = new THREE.Texture(canvas) 
	texture1.needsUpdate = true;
    var material = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide, opacity:1} );
    material.transparent = true;
    var mesh = new THREE.Mesh(
        new THREE.SphereGeometry(60,32,32),
        material
      );
	mesh.position.x=location.x;
	mesh.position.y=location.y;
	mesh.position.z=location.z;
	mesh.beginRising=function(y){
		mesh.rising=true;
		mesh.position.y=y;
	}
	mesh.rising=false;
	scene.add(mesh);
	entryMeshes.push(mesh);
	return mesh;
}

function generateDiaryCanvas(emotion,location){
	var text=worldData.intenseEntries[emotion].body;
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	canvas.width=512;
	canvas.height=512; 	
	var maxWidth = 512;
	var lineHeight = 25;
	var x = (canvas.width - maxWidth) / 2;
	var y = 60;
	return wrapText(canvas, text, x, y, maxWidth, lineHeight,emotion);
}

//adapted from http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
function wrapText(canvas, text, x, y, maxWidth, lineHeight,emotion) {
	var context=canvas.getContext('2d');
	context.font = '20px Dosis';
	context.fillStyle = emotionToColor[emotion];
	var words = text.split(' ');
	var line = '';

	for(var n = 0; n < words.length; n++) {
	  var testLine = line + words[n] + ' ';
	  var metrics = context.measureText(testLine);
	  var testWidth = metrics.width;
	  if (testWidth > maxWidth && n > 0) {
	    context.fillText(line, x, y);
	    line = words[n] + ' ';
	    y += lineHeight;
	  }
	  else {
	    line = testLine;
	  }
	}
	context.fillText(line, x, y);
	return canvas;
}

function animateEntries(){
	var entry;
	for(var i=0; i<entryMeshes.length; i++){
		entry=entryMeshes[i];
		if(entry.rising){
			entry.material.opacity=1;
		}
		if(entry.rising&&entry.position.y<(planeHeight+10)){
			entry.position.y+=.3;
		}
		entry.rotation.z+=.001;
		entry.rotation.x+=.001;
		entry.rotation.y+=.001;
	}
}

function checkForWordBalls(intersections){
	intersections.forEach(intersection=>{
			if(intersection.object.diskType&&intersection.object.diskType==='wordBall'){
				console.log('found a wrapped ball!');
				console.log(intersection.object);
				if(!intersection.object.associatedBall.rising){
					var newYPos=controls.getObject().position.y-100;
					intersection.object.associatedBall.beginRising(newYPos);
				}
			}
		});

}


//remove
// var emotionsToColors={'sadness':'blue','fear':'purple','anger':'red','joy':'orange'}
//////USEFUL FOR TESTING//////
		//REMOVE AND REMOVE DICT ABOVE!!
		// var geometry = new THREE.SphereGeometry( 50, 32, 32 );
		// var material = new THREE.MeshBasicMaterial( {color: emotionsToColors[emotion]} );
		// var sphere = new THREE.Mesh( geometry, material );
		// sphere.position.x=song.entryMesh.position.x;
		// sphere.position.z=song.entryMesh.position.z;
		// sphere.position.y=200;
		// scene.add( sphere );
