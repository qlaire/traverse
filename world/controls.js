function initOrbitControls(){
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 100, 0);
}

function animateOrbitControls(){
	controls.update();
}


var camera, scene, renderer;
var geometry, material, mesh;
var controls;

var controlsEnabled, moveForward, moveBackward, moveLeft, moveRight, canJump, prevTime, velocity;

var objects=[];

var raycaster;

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

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

	prevTime = performance.now();
	velocity = new THREE.Vector3();


	controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

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
	controls.getObject().position.x=xBound;
	controls.getObject().position.y=600;


}
var raycount=0;
function animatePointerLockControls(){

	if ( controlsEnabled ) {
		//for console.logging
		raycount++;

		//
		raycaster.ray.origin.copy( controls.getObject().position );

		var intersections = raycaster.intersectObjects([terrain]);
		var isOnObject = intersections.length > 0;
		var time = performance.now();
		var delta = ( time - prevTime ) / 1000;

		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;

		var currPosition=controls.getObject().position;

		if ( moveForward ) velocity.z -= 400.0 * delta;
		if ( moveBackward ) velocity.z += 400.0 * delta;

		if ( moveLeft ) velocity.x -= 400.0 * delta;
		if ( moveRight ) velocity.x += 400.0 * delta;

		//Prevent overstepping world bounds
		if(currPosition.x>=xBound){
			velocity.x=0;
			velocity.z=0;
			controls.getObject().position.x=xBound-1;

		}
		else if(currPosition.x<=-xBound){
			velocity.x=0;
			velocity.z=0;
			controls.getObject().position.x=xBound+1;
		}
		if(currPosition.z>=zBound){
			velocity.x=0;
			velocity.z=0;
			controls.getObject().position.z=zBound-1;

		}
		else if(currPosition.z<=-zBound){
			velocity.x=0;
			velocity.z=0;
			controls.getObject().position.z=zBound+1;
		}
		
		var distToGround;
		if ( isOnObject === true ) {
			if(raycount%100===0){
				console.log('world',controls.getObject());

			};
			distToGround=intersections[0].distance;
			controls.getObject().position.y=(controls.getObject().position.y-distToGround)+20;

		}


		controls.getObject().translateX( velocity.x * delta );
		//controls.getObject().translateY( velocity.y * delta );
		controls.getObject().translateZ( velocity.z * delta );



		prevTime = time;

	}
}

