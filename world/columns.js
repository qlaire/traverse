var columnGlow;

function createColumn(x, y, z) {
  var columnRadius=5;
  var geometry = new THREE.CylinderGeometry(columnRadius,columnRadius, 4000, 32*4, 200 );
  // var geometry = new THREE.SphereGeometry(100, 32, 16);
  var material = new THREE.MeshBasicMaterial( {color: new THREE.Color('gray'), transparent: true, opacity: 0.5 } );
  var cylinder = new THREE.Mesh( geometry, material );
  scene.add( cylinder );
  
  cylinder.position.x = x;
  cylinder.position.y = y;
  cylinder.position.z = z;

  //shader
  var glowShader = {
    vertex:
    `
    uniform vec3 viewVector;
    uniform float c;
    uniform float p;
    varying float intensity;
    uniform float time;
    void main() 
    {
      vec3 vNormal = normalize( normalMatrix * normal );
      vec3 vNormel = normalize( normalMatrix * viewVector );
      intensity = pow( c - dot(vNormal, vNormel), p );
      vec3 rippled = position + vNormal * sin(uv.y + time / 100.0);
      gl_Position = projectionMatrix * modelViewMatrix * vec4( rippled, 1.0 );
    }
  
    `,
    fragment:
    `
    uniform vec3 glowColor;
    varying float intensity;
    void main() 
    {
      vec3 glow = glowColor * intensity;
        gl_FragColor = vec4( glow, 1.0 );
    }
    `
  };

  // create custom material from the shader code in world.html
	//   that is within specially labeled script tags
	var customMaterial = new THREE.ShaderMaterial( 
	{
	    uniforms: 
		{ 
			"c":   { type: "f", value: 0.2 },
			"p":   { type: "f", value: 0.5 },
      "time": {type: "f", value: 0},
			glowColor: { type: "c", value: new THREE.Color(0x80b5ec) },
			viewVector: { type: "v3", value: camera.position }
		},
		vertexShader:   glowShader.vertex,
		fragmentShader: glowShader.fragment,
		side: THREE.DoubleSide,
		blending: THREE.AdditiveBlending,
		transparent: true
	}   );

  console.log('camera position', camera.position);

  columnGlow = new THREE.Mesh(geometry.clone(), customMaterial);
  columnGlow.position = cylinder.position;
  columnGlow.position.x=cylinder.position.x;
  columnGlow.position.y=cylinder.position.y;
  columnGlow.position.z=cylinder.position.z;

  console.log(columnGlow.position);
  console.log(cylinder.position);
  columnGlow.scale.multiplyScalar(2);
  scene.add(columnGlow);

  placeDisk(x,z,columnRadius,'column');
}

function columnUpdate(ts)
{
	columnGlow.material.uniforms.viewVector.value = 
		new THREE.Vector3().subVectors( camera.position, columnGlow.position );
  columnGlow.material.uniforms.time.value = ts;
}

function placeColumns() {
  let numColumns = Math.ceil(Object.keys(xZones).length / 60);
  let zCoord, xCoord;
  let yCoord = 0;
  for (var i = 0; i < numColumns; i++) {
    zCoord = zZones[999]-Math.random()*(zZones[999]-zZones[2]);
    var bound=Math.floor((Object.keys(xZones).length-2)/2)
    xCoord = xZones[0] + Math.random() * (xZones[bound] - xZones[0]);
    createColumn(xCoord, yCoord, zCoord);
  }
}

function checkIfInColumn(intersections){
  var inColumn=false;
  var columnLocation=null;
  intersections.forEach(intersection=>{
    if(intersection.object.diskType&&intersection.object.diskType==='column'){
      inColumn=true;
      columnLocation=intersection.object.position;
    }
  });
  return [inColumn,columnLocation];
}

function executeColumnLogic(intersections,playerMovements,controls,worldCoords){
    //Retrieve and unpack column info
    var columnInfo=checkIfInColumn(intersections);
    playerMovements.column.inColumn=columnInfo[0];
    playerMovements.column.columnLocation=columnInfo[1];
    checkMovingUpSequence(playerMovements);
    checkMovingDownSequence(playerMovements,worldCoords,controls);
}

function checkMovingUpSequence(playerMovements){
    if(playerMovements.column.inColumn&&!playerMovements.starWalked&&!playerMovements.backToEarth){
      //in column, going up, not on plane
      if(controls.getObject().position.y<planeHeight+20){
        disableMovement(playerMovements);
        playerMovements.moveUp=true;    
      }
      //in column, on plane
      else{
        playerMovements.onPlane=true;
      }
    } 
}

function checkMovingDownSequence(playerMovements,worldCoords,controls){
    //on plane, not in column - registers that you've walked the stars
    if(playerMovements.onPlane&&!playerMovements.column.inColumn&&!playerMovements.starWalked){
      playerMovements.starWalked=true;
    }
    //already starwalked
    if(playerMovements.starWalked&&playerMovements.column.inColumn){
      //you're not on the terrain yet
      if(controls.getObject().position.y>(worldCoords.y+20)){
        playerMovements.onPlane=false;
        disableMovement(playerMovements);
        playerMovements.moveDown=true;
        controls.getObject().position.x=playerMovements.column.columnLocation.x;
        controls.getObject().position.z=playerMovements.column.columnLocation.z;
        planeGlimmered=false; //this is out of place :/
      }
      //you're on the terrain 
      else{
        playerMovements.moveDown=false;
        playerMovements.backToEarth=true;
        playerMovements.starWalked=false;
      }
    }
    if(!playerMovements.column.inColumn){
      playerMovements.backToEarth=false;
    }
}

function disableMovement(playerMovements){
      playerMovements.moveForward=false;
      playerMovements.moveBackward=false;
      playerMovements.moveLeft=false;
      playerMovements.moveRight=false;  
}

