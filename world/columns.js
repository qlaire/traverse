function createColumn(x, y, z) {
  var columnRadius=5;
  var geometry = new THREE.CylinderGeometry(columnRadius,columnRadius, 4000, 32 );
  var material = new THREE.MeshBasicMaterial( {color: 0x7bbdec, wireframe: true} );
  var cylinder = new THREE.Mesh( geometry, material );
  cylinder.position.x = x;
  cylinder.position.y = y;
  cylinder.position.z = z;
  placeDisk(x,z,columnRadius,'column');
  scene.add( cylinder );
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

