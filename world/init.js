var terrain;
var camera;
var scene;
var renderer;
var controls;

function init() {
    // Create a scene
    scene = new THREE.Scene();
    // Add the camera
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0,0,0);
    // Add scene elements
    terrain=makeTerrain();
    scene.add(terrain)
    mainLights();
    pointLights();
    placeWords();
    placeColumns();
    placePlane();
    addSky();
    placeMusic();
    // Create the WebGL Renderer
    renderer = new THREE.WebGLRenderer({alpha: true,  antialias: false });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );
    // Add a resize event listener
    window.addEventListener( 'resize', onWindowResize, false );
    //initialize controls
    initPointerLockControls();

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}