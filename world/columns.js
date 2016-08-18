function createColumn() {
  var geometry = new THREE.CylinderGeometry( 5, 5, 4000, 32 );
  var material = new THREE.MeshBasicMaterial( {color: 0x7bbdec, wireframe: true} );
  var cylinder = new THREE.Mesh( geometry, material );
  cylinder.position.x = 1020;
  cylinder.position.y = 19;
  cylinder.position.z = 20;
  scene.add( cylinder );
}

function placeColumns() {
  
}

