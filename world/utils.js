var disks=[];
function placeDisk(x,z,radius,type){
  var geometry = new THREE.CylinderGeometry( radius, radius, 0, 32 );
  var material = new THREE.MeshBasicMaterial( {color: 'red'} );
  var cylinder = new THREE.Mesh( geometry, material );
  cylinder.position.x = x;
  cylinder.position.y = -1;
  cylinder.position.z = z;

  cylinder.diskType=type;
  scene.add( cylinder );
  disks.push(cylinder);
  return cylinder;
}