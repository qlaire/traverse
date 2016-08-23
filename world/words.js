var wordMeshes=[];

function placeWords(){
	var word;
	var wordsInChunk;
	var xBound1,xBound2, yBound1, yBound2;
	var xCoord, yCoord, zCoord;
	var words=worldData.keywords;
	for(var i=0;i<words.length; i++){
		wordsInChunk=Object.keys(words[i]);
		// console.log('entry start',xZones[i], 'entry end',xZones[i-1])
		for(var j=0; j<wordsInChunk.length; j++){
			word=wordsInChunk[j];
			xCoord=xZones[i]+Math.random()*(xZones[1]-xZones[0]);
			zCoord = zZones[999]-Math.random()*(zZones[999]-zZones[2]);
			yCoord = 50 + Math.random() * 600;
			wordMeshes.push(placeAWord(word,xCoord,yCoord,zCoord,words[i][word]));
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
function placeAWord(word, x, y, z,score){
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
      
    var material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
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

var sentenceMeshes=[];

// function placeASentence(sentence, location){
// 	// create a canvas element
// 	var canvas1 = document.createElement('canvas');
// 	canvas1.width=256;
// 	canvas1.height=256; 
// 	var context1 = canvas1.getContext('2d');
// 	// var fontSize=calculateFontSize(word);
// 	context1.font = "40px Arial";
// 	context1.fillStyle='red';
// 	//Math.random()>.8? context1.fillStyle = "#FDAA43" : context1.fillStyle="#FFFFFF";
//     context1.fillText(sentence,0,50);
    
// 	// canvas contents will be used for a texture
// 	var texture1 = new THREE.Texture(canvas1) 
// 	texture1.needsUpdate = true;
      
//     var material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
//     material1.transparent = true;

//     var mesh1 = new THREE.Mesh(
//         new THREE.PlaneGeometry(256, 256),
//         material1
//       );
// 	mesh1.position.x=location.x;
// 	mesh1.position.y=location.y;
// 	mesh1.position.z=location.z;
// 	// set(location);
// 	mesh1.rotation.y=Math.PI/2;
// 	mesh1.minusZ=(Math.random()>.5);
// 	mesh1.minusX=(Math.random()>.5);
// 	sentenceMeshes.push(mesh1);
// 	scene.add( mesh1 );
// 	// var geometry = new THREE.SphereGeometry( 50, 32, 32 );
// 	// var material = new THREE.MeshBasicMaterial( {color:'red'});
// 	// var sphere = new THREE.Mesh( geometry, material );
// 	// sphere.position.x=location.x;
// 	// sphere.position.z=location.z;
// 	// sphere.position.y=200;
// 	// scene.add( sphere );
// 	return mesh1;
// }

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
	mesh.rising=false;
	scene.add(mesh);
	entryMeshes.push(mesh);
	return mesh;
}


function animateWords(){
	animateSingleWords();
	animateEntries();
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
		//word.rotation.y+=.01*Math.random();
	}
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



