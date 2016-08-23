var disks=[];
function placeDisk(x,z,type){
  var geometry = new THREE.CylinderGeometry( 5, 5, 0, 32 );
  var material = new THREE.MeshBasicMaterial( {color: 'red'} );
  var cylinder = new THREE.Mesh( geometry, material );
  cylinder.position.x = x;
  cylinder.position.y = -1;
  cylinder.position.z = z;

  cylinder.diskType=type;
  scene.add( cylinder );
  disks.push(cylinder);
}