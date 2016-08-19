function addSky(){
	var geometry = new THREE.SphereGeometry(2000, 60, 40);  


	var material = new THREE.MeshLambertMaterial( {  
	  color: 'white', map: THREE.ImageUtils.loadTexture('assets/cloud.png')
	});

	skyBox = new THREE.Mesh(geometry, material);  
	skyBox.scale.set(-1, 1, 1);  
	skyBox.eulerOrder = 'XZY';  
	skyBox.renderDepth = 1000.0;  
	scene.add(skyBox);  
	scene.fog = new THREE.FogExp2( 'white', 0.00025 );

}