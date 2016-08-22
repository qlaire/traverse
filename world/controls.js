var camera, scene, renderer;
var geometry, material, mesh;
var controls;

var controlsEnabled, moveForward, moveBackward, moveLeft, moveRight, canJump, prevTime, velocity, speedUp, moveUp, onPlane,moveDown, starWalked, backToEarth;

var objects=[];

var raycaster;

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;


//POINTERLOCCK CONTROLS
function initPointerLockControls(){
	if ( havePointerLock ) {
		var element = document.body;
		var pointerlockchange = function ( event ) {
			if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
				controlsEnabled = true;
				controls.enabled = true;
				blocker.style.display = 'none';

			} else {
				controls.enabled = false;
				blocker.style.display = '-webkit-box';
				blocker.style.display = '-moz-box';
				blocker.style.display = 'box';
				instructions.style.display = '';
			}
		};
		var pointerlockerror = function ( event ) {
			instructions.style.display = '';
		};

		// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

		instructions.addEventListener( 'click', function ( event ) {

			instructions.style.display = 'none';

			// Ask the browser to lock the pointer
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

			if ( /Firefox/i.test( navigator.userAgent ) ) {

				var fullscreenchange = function ( event ) {

					if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

						document.removeEventListener( 'fullscreenchange', fullscreenchange );
						document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

						element.requestPointerLock();
					}

				};

				document.addEventListener( 'fullscreenchange', fullscreenchange, false );
				document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

				element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

				element.requestFullscreen();

			} else {

				element.requestPointerLock();

			}

		}, false );

	} else {

		instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

	}

	controlsEnabled = false;

	moveForward = false;
	moveBackward = false;
	moveLeft = false;
	moveRight = false;
	speedUp = false;
	starWalked=false;

	prevTime = performance.now();
	velocity = new THREE.Vector3();


	controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 16: // shift
				// increase speed
				speedUp = true;
				break;
			
			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;
			
		}

	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 16: // shift
				// slow back down
				speedUp = false;
				break;
			
			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

		}

	};

	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 3001 );
	//Set positions
	controls.getObject().position.z=0;
	controls.getObject().position.x=xZones[Object.keys(xZones).length-3];
	controls.getObject().position.y=600;
	//TODO: DRY this up
	skyBox.position.x=controls.getObject().position.x;
	skyBox.position.y=controls.getObject().position.y;
	skyBox.position.z=controls.getObject().position.z;


}


var raycount=0;
function animatePointerLockControls(){
	moveUp=false;
	//moveDown=false;
	if ( controlsEnabled ) {
		//for console.logging
		raycount++;

		//
		raycaster.ray.origin.copy( controls.getObject().position );

		var intersections = raycaster.intersectObjects([terrain].concat(disks));
		var isOnObject = intersections.length > 0;
		var time = performance.now();
		var delta = ( time - prevTime ) / 1000; //real
		// var delta = 10 * ( time - prevTime ) / 1000; //testing

		//console.log('planeHeight',planeHeight);
		//tweak this logic later, only works for lifting
		var columnInfo=checkIfInColumn(intersections);
		var inColumn=columnInfo[0];
		var columnLocation=columnInfo[1];

		//MOVE THIS
		// if (inColumn) {
		// 	silenceMusic();
		// }
		if(inColumn&&!starWalked&&!backToEarth){
			//in column, going up, not on plane
			if(controls.getObject().position.y<planeHeight+20){
				console.log(1);
				moveForward=false;
				moveBackward=false;
				moveLeft=false;
				moveRight=false;
				moveUp=true;		
			}
			//in column, on plane
			else{
				console.log(2);
				onPlane=true;
			}
		} 
		//on plane, not in column - registers that you've walked the stars
		if(onPlane&&!inColumn&&!starWalked){
			console.log(3);
			starWalked=true;
		}

		//already starwalked
		if(starWalked&&inColumn){
			//you're not on the terrain yet
			if(controls.getObject().position.y>(intersections[0].point.y+20)){
				console.log(4);
				onPlane=false;
				moveForward=false;
				moveBackward=false;
				moveLeft=false;
				moveRight=false;
				moveDown=true;
				controls.getObject().position.x=columnLocation.x;
				controls.getObject().position.z=columnLocation.z;

			}
			//you're on the terrain 
			else{
				console.log(5);
				moveDown=false;
				backToEarth=true;
				starWalked=false;
			}
		}
		if(!inColumn){
			backToEarth=false;
		}
		//MOVE ELSEWHERE
		if(onPlane||moveUp){
			outsideTime();
		}


		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;

		var currPosition=controls.getObject().position;

		if (moveForward) {
			if (speedUp) {
				velocity.z -= 1600.0 * delta;
			} else {
				velocity.z -= 400.0 * delta;
			}
		}

		if (moveBackward) {
			if (speedUp) {
				velocity.z += 800.0 * delta;
			} else {
				velocity.z += 400.0 * delta;
			}
		}

		if (moveLeft) {
			if (speedUp) {
				velocity.x -= 1600.0 * delta;
			} else {
				velocity.x -= 400.0 * delta;
			}
		}

		if (moveRight) {
			if (speedUp) {
				velocity.x += 1600.0 * delta;
			} else {
				velocity.x += 400.0 * delta;
			}
		}
		if (moveUp) {
			controls.getObject().position.y +=1;
		}
		if (moveDown) {
			controls.getObject().position.y -=1;
		}

		//Prevent overstepping world bounds
		if(currPosition.x>=xBound){
			velocity.x=0;
			velocity.z=0;
			controls.getObject().position.x=xBound-1;

		}
		else if(currPosition.x<=-xBound){
			velocity.x=0;
			velocity.z=0;
			controls.getObject().position.x=-xBound+1;
		}
		if(currPosition.z>=zBound){
			velocity.x=0;
			velocity.z=0;
			controls.getObject().position.z=zBound-1;

		}
		else if(currPosition.z<=-zBound){
			velocity.x=0;
			velocity.z=0;
			controls.getObject().position.z=-zBound+1;
		}
		
		var distToGround;
		changeAudioVolume(intersections[0].point,onPlane);

		if ( isOnObject === true && !moveUp && !onPlane && !moveDown) { //TODO: not when on interstellar plane
			if(raycount%200===0){
				console.log('intersection',intersections[0].point);
				console.log(getLocation(intersections[0].point));
				//console.log('world',terrain.localToWorld(intersections[0].point));
			};
			//changeAudioVolume(intersections[0].point);

			updateDate(intersections[0].point);
			distToGround=intersections[0].distance;
			controls.getObject().position.y=(controls.getObject().position.y-distToGround)+20;

		}


		controls.getObject().translateX( velocity.x * delta );
		controls.getObject().translateZ( velocity.z * delta );
		//controls.getObject().translateY( velocity.y * delta );
		skyBox.position.x=controls.getObject().position.x;
		skyBox.position.y=controls.getObject().position.y;
		skyBox.position.z=controls.getObject().position.z;



		prevTime = time;

	}
}



function checkIfInColumn(intersections){
	var inColumn=false;
	var columnLocation=null;
	intersections.forEach(intersection=>{
		if(intersection.object.isDisk){
			inColumn=true;
			columnLocation=intersection.object.position;
		}
	});
	return [inColumn,columnLocation];

}


//for intersection, x goes side to side, y goes up, and z goes backward
//appears to be the same in the WORLD
//worldCoords will be intersections[0].point
function getLocation(worldCoords){
	var toReturn={};
	// console.log('worldCoords',worldCoords);
	var localCoords=terrain.worldToLocal(worldCoords);
	// console.log('localCoords',localCoords);
	var xCoord=customFloor(localCoords.x,distanceX);
	var yCoord=customFloor(localCoords.y,distanceY);
	var locationInfo=vertexDict[[xCoord,yCoord]];
	if(!locationInfo){
		return {path: -1, entry: -1};
	}
	toReturn.path=locationInfo[0];
	toReturn.entry=locationInfo[locationInfo.length-1];
	return toReturn;	
}

//make sure we don't have more tha one of these!!!
function customFloor(num,factor){
  return factor * Math.floor(num/factor);
}
