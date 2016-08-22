// var words=[{"dank memes":"0.9","new girl":"0.9","good chemistry":"0.8","number":"0.5","boyfriend":"0.4","feelings":"0.4","thing":"0.4","work":"0.4","friend":"0.4","guy":"0.4"},{"movie our friend":"1.0","vacation":"0.6","lips":"0.6","cheek":"0.6","Florida":"0.5","date":"0.5","quarter":"0.5","house":"0.5","Netflix":"0.5"},{"long time":"0.9","awkward thing":"0.8","fucking meme.":"0.7","dumb thing":"0.7","protagonist":"0.3","defeat":"0.3","moment":"0.3","happiness":"0.3","happening.":"0.3","error":"0.3"},{"new job":"1.0","work":"0.7","people":"0.7"},{"scathing reviews":"1.0","opposite":"0.7"},{"suggestion":"0.9","Hoo":"0.9","things":"0.7","performance":"0.6"},{"highest rank":"0.9","eagle scout":"0.8","Boy Scouting":"0.6","boys":"0.3"},{"merit badges":"0.9","cub scout":"0.8","hard work":"0.8","easy task":"0.8","honor":"0.5","thing":"0.5","rank":"0.5","life":"0.4","foundation":"0.4"},{"local animal shelter":"1.0","wonderful honor":"0.9","service project":"0.8","eagle scout":"0.8","boy scout":"0.7","dog":"0.4","trail":"0.4","life":"0.4"},{"pediatric doctor":"1.0","Hey":"0.7","courage":"0.7","anxiety":"0.7","reason":"0.7","kind":"0.7","laptop":"0.6","medication":"0.6","follow":"0.6","help":"0.6"},{"normal thing":"0.9","nurse practitioner":"0.9","thyroid test":"0.9","new doctor":"0.8","new medication":"0.8","appointment":"0.5","meantime":"0.3","hell":"0.3","emails":"0.2","dozens":"0.2"},{"urgent care place":"1.0","nice guy":"0.8","24-hour walk":"0.8","huge headache":"0.8","doctors office":"0.7","new doctor":"0.7","win-win":"0.5","emergencies":"0.4","appointments":"0.4","anxiety":"0.4"},{"smiley flirtatious thing":"0.9","random Facebook message":"0.9","foreseeable future":"0.7","big crush":"0.7","Long story":"0.7","coworker":"0.5","schedule":"0.5","somebody":"0.4","excuse":"0.4","vice":"0.4"},{"progressively heavy flirting":"0.9","local pizza place":"0.9","short notice":"0.8","great time":"0.7","bar":"0.5","arboretum":"0.4","kind":"0.4","couple":"0.4","bit":"0.4","numbers":"0.4"},{"campus haha":"1.0","various spots":"0.9","respective ways":"0.9","drive home":"0.9","great time":"0.8","bench":"0.6","feeling":"0.6","Hey":"0.5","hand":"0.5","morning":"0.5"},{"thing":"1.0","time":"0.8"},{"time":"1.0","friends":"1.0","plans":"0.9","stuff":"0.9","bed":"0.9"},{"tedious drag":"1.0","anti depressants":"0.9","nightmare":"0.6","medication":"0.6"},{"tall gay scumbag":"0.9","obscene things":"0.8","severe depression":"0.8","standard spectacle":"0.7","tiny town":"0.7","gay dude":"0.7","huge beard":"0.7","blue eyes":"0.7","girl online":"0.6","sympathy":"0.4"},{"Typical wannabe indie":"1.0","awesome job catfishing":"0.9","coolest fucking":"0.7","super masculine":"0.7","attention whore":"0.7","tinder account":"0.7","Perfect eyes":"0.6","batman tees":"0.6","catfish scum":"0.6","iron maiden":"0.6"},{"long emo message":"1.0","gay guy":"0.8","weird pit":"0.8","personal Instagram":"0.8","terrible state":"0.8","self loathing":"0.8","time":"0.6","love":"0.6","fuck":"0.6","shitstorm":"0.6"},{"severe social anxiety":"1.0","test kit":"0.9","new world":"0.6","research chemical":"0.6","psychedelics":"0.5","inferiority":"0.4","life":"0.4","dabbles":"0.4","LSD":"0.3","excitement":"0.3"},{"long term effects":"0.9","big toes":"0.8","copious amounts":"0.7","doctors appointment":"0.7","physical issues":"0.7","good deal":"0.7","life":"0.5","shit":"0.5","ups":"0.5","downs":"0.5"},{"slight chance":"1.0","toe numbness":"0.8","new obstacles":"0.8","abysmal life":"0.7","real cause":"0.7","new line":"0.7","solid group":"0.7","parents":"0.3","bullshit":"0.3","decreases":"0.2"},{"loneliness":"0.9","sorrows":"0.9","period":"0.8","change":"0.7","relationship":"0.7"},{"depression":"1.0","symptoms":"0.9","friend":"0.9","things":"0.8","point":"0.8"},{"different kinds":"0.9","depression tests":"0.8","symptoms change":"0.7","similar experience":"0.7"},{"bed":"1.0","mornings":"0.8","decade":"0.8","life":"0.7","people":"0.7","energy":"0.7"},{"negative things":"0.9","emotional abuse":"0.9","people":"0.7","excuse":"0.6","Depression":"0.5","Ad":"0.5","job":"0.5","TV":"0.5","family":"0.5","life":"0.5"},{"reality":"1.0","enjoyment":"0.9","things":"0.8","people":"0.8"}];


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
	context1.font = fontSize+"px Arial";
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
function printEntry(emotion,location){
	if(worldData.intenseEntries[emotion].complete===true){
		return;
	}
	worldData.intenseEntries[emotion].complete=true;
	createDiaryBall(emotion,location);
}

function createDiaryBall(emotion,location){
    var canvas=generateDiaryCanvas(emotion,location);
	var texture1 = new THREE.Texture(canvas) 
	texture1.needsUpdate = true;
    var material = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
    material.transparent = true;
    var mesh = new THREE.Mesh(
        new THREE.SphereGeometry(60,32,32),
        material
      );
	mesh.position.x=location.x;
	mesh.position.y=location.y;
	mesh.position.z=location.z;
	scene.add(mesh);
	entryMeshes.push(mesh);
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
		if(entry.position.y<(planeHeight+10)){
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
	context.font = '20px Arial';
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



