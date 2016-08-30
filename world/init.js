var terrain;
var camera;
var scene;
var renderer;
var controls;

/*Initializes a scene and populates it with terrain, lights, word, columns*/
function init() {
    // Create a scene
    scene = new THREE.Scene();
    // Add the camera
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0,0,0);

    // Add scene elements
    terrain=makeTerrain(); //mkTerrain.js
    scene.add(terrain)
    mainLights();  //lights.js
    pointLights();
    var columnPos=placeColumns(); //columns.js
    placeWords(columnPos); //words.js
    placePlane(); //interstellarPlane.js
    addSky(); //sky.js
    placeMusic(); //music.js

    // Create the WebGL Renderer
    renderer = new THREE.WebGLRenderer({alpha: true,  antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );

    // Add a resize event listener
    window.addEventListener( 'resize', onWindowResize, false );

    //initialize controls
    initPointerLockControls(); //controls.js

    //Update screen message
    printInstructions(); //see below

}

/*Removes load message and replaces with instructions*/
function printInstructions(){
    document.getElementById('instructions').className='displayed';
    document.getElementById('loading').className='hidden';
}

/*Scales world to window*/
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}