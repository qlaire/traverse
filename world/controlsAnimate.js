
function animatePointerLockControls(){
	playerMovements.moveUp=false;
	if (playerMovements.controlsEnabled ) {
		//Cast ray and retrieve coordinates
		raycaster.ray.origin.copy( controls.getObject().position );
		var intersections = raycaster.intersectObjects([terrain].concat(disks));
		playerMovements.isOnObject = intersections.length > 0;
		var worldCoords=intersections[0].point;
		//Set time
		var time = performance.now();
		var delta = ( time - prevTime ) / 1000; 
		//update world based on position
		executeColumnLogic(intersections,playerMovements,controls,worldCoords);
		updateKey(playerMovements);
		checkForWordBalls(intersections,playerMovements);
		glimmerPlane(playerMovements);
		changeAudioVolume(worldCoords,playerMovements.onPlane);
		//slow down smoothly
		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;
		//update position (x/z)
		var currPosition=controls.getObject().position;
		updatePlayerPosition(playerMovements,velocity,delta);
		preventOverstepping(currPosition,velocity);
		//update y
		updatePlayerHeight(controls,intersections,playerMovements);
		//actual movement
		controls.getObject().translateX( velocity.x * delta );
		controls.getObject().translateZ( velocity.z * delta );
		moveSkyBox();
		prevTime = time;

	}
}

function moveSkyBox(){
	skyBox.position.x=controls.getObject().position.x;
	skyBox.position.y=controls.getObject().position.y;
	skyBox.position.z=controls.getObject().position.z;
}

function updatePlayerHeight(controls,intersections,playerMovements){
	var distToGround;
	if (playerMovements.isOnObject === true && !playerMovements.moveUp && !playerMovements.onPlane && !playerMovements.moveDown) {
		distToGround=intersections[0].distance;
		controls.getObject().position.y=(controls.getObject().position.y-distToGround)+20;
	}
}


var getLocation = (function() {
	var local = new THREE.Vector3(0, 0, 0)
	return function getLocation(worldCoords){
		var toReturn={};
		var localCoords=terrain.worldToLocal(local.copy(worldCoords));
		var zCoord=customFloor(localCoords.x,globalTerrainData.distanceZ);
		var xCoord=customFloor(localCoords.y,globalTerrainData.distanceX);
		var locationInfo=globalTerrainData.vertexDict[[zCoord,xCoord]];
		if(!locationInfo){
			return {path: -1, entry: -1};
		}
		toReturn.path=locationInfo[0];
		toReturn.entry=locationInfo[locationInfo.length-1];
		return toReturn;	
}})()

function updatePlayerPosition(playerMovements,velocity,delta){
		if (playerMovements.moveForward) {
			if (playerMovements.speedUp) {
				velocity.z -= 1600.0 * delta;
			} else {
				velocity.z -= 400.0 * delta;
			}
		}

		if (playerMovements.moveBackward) {
			if (playerMovements.speedUp) {
				velocity.z += 800.0 * delta;
			} else {
				velocity.z += 400.0 * delta;
			}
		}

		if (playerMovements.moveLeft) {
			if (playerMovements.speedUp) {
				velocity.x -= 1600.0 * delta;
			} else {
				velocity.x -= 400.0 * delta;
			}
		}

		if (playerMovements.moveRight) {
			if (playerMovements.speedUp) {
				velocity.x += 1600.0 * delta;
			} else {
				velocity.x += 400.0 * delta;
			}
		}
		if (playerMovements.moveUp) {
			controls.getObject().position.y +=1;
		}
		if (playerMovements.moveDown) {
			controls.getObject().position.y -=1;
		}	
}

function preventOverstepping(currPosition,velocity){
		if(currPosition.x>=globalTerrainData.xBound){
			velocity.x=0;
			velocity.z=0;
			controls.getObject().position.x=globalTerrainData.xBound-1;

		}
		else if(currPosition.x<=-globalTerrainData.xBound){
			velocity.x=0;
			velocity.z=0;
			controls.getObject().position.x=-globalTerrainData.xBound+1;
		}
		if(currPosition.z>=globalTerrainData.zBound){
			velocity.x=0;
			velocity.z=0;
			controls.getObject().position.z=globalTerrainData.zBound-1;

		}
		else if(currPosition.z<=-globalTerrainData.zBound){
			velocity.x=0;
			velocity.z=0;
			controls.getObject().position.z=-globalTerrainData.zBound+1;
		}
}

//make sure we don't have more tha one of these!!!
function customFloor(num,factor){
  return factor * Math.floor(num/factor);
}
