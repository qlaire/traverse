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

function randomXInEmotion(emotion){
  var bound1, bound2;
  if(emotion==='anger'){
    bound1=globalTerrainData.zZones[2];
    bound2=globalTerrainData.zZones[1]; 

  }
  if(emotion==='joy'||emotion=='sadness'){
    bound1=globalTerrainData.zZones[1];
    bound2=globalTerrainData.zZones[0]; 
  }
  if(emotion==='fear'){
    bound1=globalTerrainData.zZones[0];
     bound2=globalTerrainData.zZones[999];  

  }
  var xCoord=bound1+(Math.random()*(bound2-bound1));
  return  xCoord;
}