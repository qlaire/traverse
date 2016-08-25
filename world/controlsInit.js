// var camera, scene, renderer;
var geometry, material, mesh;
var controls;

var prevTime, velocity;

//TODO: Finish this refactoring
var playerMovements={moveForward:false,moveBackward:false,moveLeft:false,moveRight:false,speedUp:false,starWalked:false,controlsEnabled:false,moveDown:false,onPlane:false,backToEarth:false,column:{inColumn:false,columnLocation:null},isOnObject:false}


var objects=[];

var raycaster;

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;


//POINTERLOCCK CONTROLS - adapted from mrdoob
function initPointerLockControls(){
	if ( havePointerLock ) {
		var element = document.body;
		var pointerlockchange = function ( event ) {
			if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
				playerMovements.controlsEnabled = true;
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
	prevTime = performance.now();
	velocity = new THREE.Vector3();
	controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );
	var onKeyDown = function ( event ) {
		switch ( event.keyCode ) {
			case 16: // shift
				// increase speed
				playerMovements.speedUp = true;
				break;
			case 38: // up
			case 87: // w
				playerMovements.moveForward = true;
				break;

			case 37: // left
			case 65: // a
				playerMovements.moveLeft = true; break;

			case 40: // down
			case 83: // s
				playerMovements.moveBackward = true;
				break;
			case 39: // right
			case 68: // d
				playerMovements.moveRight = true;
				break;
		}
	};
	var onKeyUp = function ( event ) {
		switch( event.keyCode ) {
			case 16: // shift
				// slow back down
				playerMovements.speedUp = false;
				break;
			case 38: // up
			case 87: // w
				playerMovements.moveForward = false;
				break;
			case 37: // left
			case 65: // a
				playerMovements.moveLeft = false;
				break;
			case 40: // down
			case 83: // s
				playerMovements.moveBackward = false;
				break;
			case 39: // right
			case 68: // d
				playerMovements.moveRight = false;
				break;
      case 88: // x
        renderer.render(scene, camera);

       var evt = new CustomEvent('screenshot', {
        detail: {imgUrl: renderer.domElement.toDataURL()}
       })
        window.dispatchEvent(evt);
        break;
		}
	};

	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 3001 );
	//Set positions
	controls.getObject().position.z=0;
	controls.getObject().position.x=xBound-paddingX/4; //xZones[Object.keys(xZones).length-3];
	controls.getObject().position.y=600;
	moveSkyBox();

}

