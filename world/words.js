var wordMeshes=[];

function placeWords(columnPos){
	var word;
	var wordsInChunk;
	var xBound1,xBound2, yBound1, yBound2;
	var xCoord, yCoord, zCoord;
	var words=worldData.keywords;
	var mesh;
	for(var i=0;i<words.length; i++){
		wordsInChunk=Object.keys(words[i]);
		for(var j=0; j<wordsInChunk.length; j++){
			word=wordsInChunk[j];
			xCoord=globalTerrainData.xZones[i]+Math.random()*(globalTerrainData.xZones[1]-globalTerrainData.xZones[0]);
			zCoord = globalTerrainData.zZones[999]-Math.random()*(globalTerrainData.zZones[999]-globalTerrainData.zZones[2]);
			yCoord = 50 + Math.random() * 600;
			mesh=placeAWord(word,xCoord,yCoord,zCoord,words[i][word],columnPos);
			if(mesh) wordMeshes.push(mesh);
		}
	}

}

function calculateFontSize(word){
	if(word.length>10){
		return Math.floor(400*(1/word.length));
	}
	else{
		return "40"
	}

}

function getDistance(wordPos,columnPos){
	    dx = wordPos.x-(columnPos.x);
	    dz = wordPos.z-(columnPos.z);	
	    return Math.sqrt( dx * dx + dz * dz );
}
function placeAWord(word, x, y, z,score, columnPos){
	console.log('in placeAWord',columnPos)
	var distance=getDistance({x:x,y:y,z:z},columnPos);
	if(distance<256){
		return;
	}
	// create a canvas element
	var canvas1 = document.createElement('canvas');
	canvas1.width=256;
	canvas1.height=256; 
	var context1 = canvas1.getContext('2d');
	var fontSize=calculateFontSize(word);
	context1.font = fontSize+"px Dosis";
	score>.8? context1.fillStyle = "#FDAA43" : context1.fillStyle="#FFFFFF";
    context1.fillText(word, 0, 50);
    
	// canvas contents will be used for a texture
	var texture1 = new THREE.Texture(canvas1) 
	texture1.needsUpdate = true;
      
    var material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide, depthWrite:false} );
    material1.transparent = true;

    var mesh1 = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        material1
      );
	mesh1.position.set(x,y,z);
	mesh1.rotation.y=Math.PI/2;
	scene.add( mesh1 );
	mesh1.goingUp=Math.floor(Math.random());
	return mesh1;
}


function animateSingleWords(){
	var word;
	for(var i=0; i<wordMeshes.length; i++){
		word=wordMeshes[i];
		if(word.goingUp){
			word.position.y+=.1;			
		}
		else{
			word.position.y-=.1;
		}
		if(word.position.y>=300){
			word.goingUp=false;
		}
		if(word.position.y<=200){
			word.goingUp=true;
		}
	}
}



