var planeHeight=600;

function placePlane(){
	var geometry = new THREE.PlaneGeometry( terrainWidth,terrainHeight, 32,32);
	var material = new THREE.MeshBasicMaterial( {color: 0x7bbdec, side: THREE.DoubleSide/*,opacity:0*/, wireframe:true} );
	// material.transparent=true;
	var plane = new THREE.Mesh( geometry, material );
	plane.position.y=planeHeight;
    plane.rotation.x = -Math.PI / 2;
	scene.add( plane );

}