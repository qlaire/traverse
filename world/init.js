var terrain;
var camera;
var scene;
var renderer;
var controls;

function init() {
  
    // Create a scene
    scene = new THREE.Scene();

    // Add the camera
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.set(0,0,0);
  
    // Add scene elements
    terrain=makeTerrain();
    scene.add(terrain)
   
    mainLights();
    pointLights();

    //words
    placeWords();

    // Create the WebGL Renderer
    renderer = new THREE.WebGLRenderer({alpha: true,  antialias: false });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
  
    // addClouds();
    // Append the renderer to the body
    document.body.appendChild( renderer.domElement );
  
    // Add a resize event listener
    window.addEventListener( 'resize', onWindowResize, false );
  
    // Add the orbit controls
    //initOrbitControls();
    initPointerLockControls();
    //postProcess();

}