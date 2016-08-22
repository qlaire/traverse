var skyBox;

function addSky(){
	var geometry = new THREE.SphereGeometry(2000, 60, 40);  


	var material = new THREE.MeshBasicMaterial( {  
	  color: 0x77CE87/*,map: THREE.ImageUtils.loadTexture('assets/cloud3.png')*/
	});

	skyBox = new THREE.Mesh(geometry, material);  
	skyBox.scale.set(-1, 1, 1);  
	skyBox.eulerOrder = 'XZY';  
	skyBox.renderDepth = 1900.0;  
	scene.add(skyBox);  
	scene.fog = new THREE.FogExp2( 0xffc09e, 0.0005 );

}

// function colorTheFog(position,path){

// //r
// //g
// //b
// 	var r, g, b;
// 	if(path===0){
		
// 	}
// }