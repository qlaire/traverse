var THREE = window.THREE
var pointerLock = require('./pointerLockControls.js');

//NOTE - must run http-server to view
var controls;
var renderer;
var mainScene, mainCamera;
var terrainScene;
var mouseX = 0;
var mouseY = 0;

var moods = [10, 1, 10, 1, 10, 1];

//last in array is the first you see
var colorDict = {
    10: ' #ffffff',
    9: ' #f2f2f2',
    8: ' #e6e6e6',
    7: ' #d9d9d9',
    6: ' #cccccc',
    5: ' #bfbfbf',
    4: ' #b3b3b3',
    3: ' #a6a6a6',
    2: ' #999999',
    1: ' #8c8c8c',
    0: ' #808080'
}

initScene();
initTerrain();
render();

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
if (havePointerLock) {
    var element = document.body;
    var pointerlockchange = function(event) {

        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
            controlsEnabled = true;
            controls.enabled = true;
            blocker.style.display = 'none';
        } else {
            controls.enabled = false;
            blocker.style.display = '-webkit-box'
            blocker.style.display = '-moz-box'
            blocker.style.display = 'box';
        }
    };

    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

    // Ask the browser to lock the pointer
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

    if (/Firefox/i.test(navigator.userAgent)) {
        var fullscreenchange = function(event) {
            if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
                document.removeEventListener('fullscreenchange', fullscreenchange);
                document.removeEventListener('mozfullscreenchange', fullscreenchange);
                element.requestPointerLock();
            }
        };

        document.addEventListener('fullscreenchange', fullscreenchange, false);
        document.addEventListener('mozfullscreenchange', fullscreenchange, false);
        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
        element.requestFullscreen();
    } else {
        element.requestPointerLock();
    }
}

function createGradient(ctx, color1, color2, yStart, yEnd) {
    var grd = ctx.createLinearGradient(0, yStart, 0, yEnd);
    grd.addColorStop(0, color1);
    grd.addColorStop(1, color2);
    return grd;
}
// create heightMap
function getHeightmap(moodArr) {
    var canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    var context = canvas.getContext('2d');

    var grd;
    var color1;
    var color2;
    var yStart;
    var yEnd;

    for (var i = 0; i < moodArr.length; i++) {
        color1 = colorDict[moodArr[i]];
        color2 = colorDict[moodArr[i + 1]] || colorDict[moodArr[i]];
        yStart = i * canvas.height / moodArr.length;
        yEnd = (i + 1) * canvas.height / moodArr.length;

        grd = createGradient(context, color1, color2, yStart, yEnd);
        context.fillStyle = grd;
        context.fillRect(0, (i * canvas.height / moodArr.length), canvas.width, canvas.height / moodArr.length);
    }

    var img = document.getElementById("noise");
    context.globalAlpha = 0.05;
    context.drawImage(img, 0, 0, 1024, 1024);
    document.body.appendChild(canvas);
    return canvas;
}

function initScene() {
    mainScene = new THREE.Scene();
    mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    mainScene.fog = new THREE.Fog(0xDFF8FD, 10.0, 1000.0);
    var ambientLight = new THREE.AmbientLight(0x111111);

    mainScene.add(ambientLight);

    controls = new THREE.PointerLockControls(mainCamera);
    mainScene.add(controls.getObject());

    var onKeyDown = function(event) {
        console.log('key pressed');
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true;
                break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if (canJump === true) velocity.y += 350;
                canJump = false;
                break;
        }
    };

    var onKeyUp = function(event) {
        console.log('key lifted');
        switch (event.keyCode) {
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

    renderer = new THREE.WebGLRenderer();
    // var renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClearColor = false;

    document.body.appendChild(renderer.domElement);
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    // document.body.addEventListener('mousemove', onMouseMove, false);

    var raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

    var container = document.getElementById('world');
    container.appendChild(renderer.domElement);
}

function initTerrain() {
    var xS = 63,
        yS = 63;
    terrainScene = THREE.Terrain({
        easing: THREE.Terrain.Linear,
        frequency: 2.5,
        heightmap: getHeightmap(moods),
        material: new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0x5566aa,
            fog: true
        }),
        maxHeight: 200,
        minHeight: -200,
        steps: 1,
        useBufferGeometry: false,
        xSegments: xS,
        xSize: 3000,
        ySegments: yS,
        ySize: 2048,
    });

    mainScene.add(terrainScene);
}

function render() {
    requestAnimationFrame(render)
    renderer.render(mainScene, mainCamera);
}

// function onMouseMove(event) {
//     mouseX = (event.clientX / window.innerWidth) * 2 - 1;
//     mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
// }


// function onKeyDown(event) {
//     if (event.keyCode === 32 || event.shiftKey) {
//         var vector = new THREE.Vector3(mouseX, mouseY, mainCamera.near);

//         // Convert the [-1, 1] screen coordinate into a world coordinate on the near plane
//         var projector = new THREE.Projector();
//         projector.unprojectVector(vector, mainCamera);

//         var cameraPosition = controls.getObject().position;

//         vector.sub(cameraPosition).normalize();
//     }
// }
< /script>
