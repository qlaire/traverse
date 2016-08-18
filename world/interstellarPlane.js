var planeHeight=600;

function placePlane(){
	var geometry = new THREE.PlaneGeometry( terrainWidth,terrainHeight, 32 );
	var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide,wireframe:true} );
	var plane = new THREE.Mesh( geometry, material );
	plane.position.y=planeHeight;
    plane.rotation.x = -Math.PI / 2;
	scene.add( plane );

}