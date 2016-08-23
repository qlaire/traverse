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



