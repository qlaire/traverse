var columnGlow;

function createColumn(x, y, z) {
  var columnRadius=5;
  var geometry = new THREE.CylinderGeometry(columnRadius,columnRadius, 4000, 32*4, 200 );
  var material = new THREE.MeshBasicMaterial( {color: new THREE.Color(0x80b5ec), transparent: true, opacity: 0.3 } );
  var cylinder = new THREE.Mesh( geometry, material );
  scene.add( cylinder );
  cylinder.position.set(x, y, z);

  //shader
  var glowShader = {
    vertex:
    `
    varying vec2 vUv;
    void main() 
    {
      vUv=uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  
    `,
    fragment:
    `
    uniform vec3 glowColor;
    varying float intensity;
    uniform float time;
    varying vec2 vUv;
    void main() 
    {
      float tick = time / 200.0;
      float intensity = (
              sin(32.0 * vUv.x + tick) +
              cos(-32.0 * vUv.y + tick)
            );
      vec3 glow = glowColor * intensity;
      gl_FragColor = vec4( glow, 1.0 );
    }
    `
  };

  // create custom material from the shader code above
	var customMaterial = new THREE.ShaderMaterial( 
	{
	    uniforms: 
		{ 
      "time": {type: "f", value: 0},
			glowColor: { type: "c", value: new THREE.Color(0x80b5ec) }
    },
		vertexShader:   glowShader.vertex,
		fragmentShader: glowShader.fragment,
		side: THREE.DoubleSide,
		blending: THREE.AdditiveBlending,
		transparent: true
	}   );

  columnGlow = new THREE.Mesh(geometry.clone(), customMaterial);
  columnGlow.position.set(x, y, z);

  console.log(columnGlow.position);
  console.log(cylinder.position);
  columnGlow.scale.multiplyScalar(1.5);
  scene.add(columnGlow);

  placeDisk(x,z,columnRadius,'column');
  return cylinder;
}

function columnUpdate(ts)
{
	// columnGlow.material.uniforms.viewVector.value = 
	// 	new THREE.Vector3().subVectors( camera.position, columnGlow.position );
  columnGlow.material.uniforms.time.value = ts;
}

function placeColumns() {
  // let numColumns = Math.ceil(Object.keys(xZones).length / 60);
  // numColumns=1;
  let zCoord, xCoord;
  let yCoord = 0;
  var cylinder;
  // for (var i = 0; i < numColumns; i++) {
  zCoord = zZones[999]-Math.random()*(zZones[999]-zZones[2]);
  var bound=Math.floor((Object.keys(xZones).length-2)/2)
  xCoord = xZones[0] + Math.random() * (xZones[bound] - xZones[0]);
  cylinder=createColumn(xCoord, yCoord, zCoord);
  // }
  return cylinder.position;

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

