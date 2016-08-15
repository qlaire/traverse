// function addClouds(){
// 	addACloud([0,400,0]);
// }

// function addACloud(position){
// 	var geometry = new THREE.PlaneGeometry( 1000, 500, 20 );
// 	var texloader = new THREE.TextureLoader();
// 	texloader.load("assets/cloud.png",function(texture){
// 		texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
// 		texture.repeat.set( 1,1 );
// 		texture.offset.set( 0,0 );
// 		texture.needsUpdate = true;
// 	    var material = new THREE.MeshBasicMaterial({ map: texture,opacity:.5,transparent:true});
// 		var mesh = new THREE.Mesh( geometry, material );
// 		mesh.position.set(...position)
// 		scene.add(mesh);
// 	}); 
// }
			
