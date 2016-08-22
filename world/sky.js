var skyBox;

function addSky(){
	var geometry = new THREE.SphereGeometry(2000, 60, 60);  

	//var skyTexture=createSkyTexture();
	// var material = new THREE.MeshBasicMaterial( {  
	//   /*color: 0x135E6B*/ /*map: skyTexture*/
	// });
	var material=createSkyMaterial();
	// material.map=THREE.ImageUtils.loadTexture('assets/cloud3.png')
	skyBox = new THREE.Mesh(geometry, material);  
	console.log(skyBox);
	skyBox.scale.set(-1, 1, 1);  
	skyBox.eulerOrder = 'XZY';  
	skyBox.renderDepth = 1900.0;  
	scene.add(skyBox); 
	skyBox.rotation.y = -Math.PI/2;
	scene.fog = new THREE.FogExp2( 0x1A2D32, 0.0005 );

}

// function addSky(){
// 	sky1 = new THREE.Sky();
// 	scene.add( sky1.mesh );
// 	console.log(sky1.mesh);

// 	// Add Sun Helper
// 	var sunSphere = new THREE.Mesh(
// 		new THREE.SphereBufferGeometry( 20000, 16, 8 ),
// 		new THREE.MeshBasicMaterial( { color: 0xffffff } )
// 	);
// 	sunSphere.position.y = - 700000;
// 	sunSphere.visible = false;
// 	scene.add( sunSphere );
// 	var uniforms = sky1.uniforms;
// 	uniforms.turbidity.value = 10;
// 	uniforms.reileigh.value = 2;
// 	uniforms.luminance.value = 1;
// 	uniforms.mieCoefficient.value = .005;
// 	uniforms.mieDirectionalG.value = .8;

// 	var theta = Math.PI * ( .49 - 0.5 );
// 	var phi = 2 * Math.PI * ( .25 - 0.5 );
// 	var distance = 1000;
// 	sunSphere.position.x = distance * Math.cos( phi );
// 	sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
// 	sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );

// 	sunSphere.visible = true;

// 	sky1.uniforms.sunPosition.value.copy( sunSphere.position );
// 	console.log(sky1);
// }



// function createSkyTexture(){
// 	var c = document.createElement('canvas');
// 	c.width=256;
// 	c.height=256; 
// 	var ctx = c.getContext("2d");
// 	var grd = ctx.createRadialGradient(128, 128, 60, 128, 128, 200);
// 	grd.addColorStop(0, "#222444");
// 	grd.addColorStop(1, "#50A897");
// 	ctx.fillStyle = grd;
// 	ctx.fillRect(0, 0, 256, 256);
// 	var texture1 = new THREE.Texture(c) 
// 	texture1.needsUpdate = true;
// 	return texture1
// }

var vertexShader=
`	
varying vec3 vWorldPosition;

void main() {

	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
	vWorldPosition = worldPosition.xyz;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}

`

var fragmentShader=
`
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;

varying vec3 vWorldPosition;

void main() {

	float h = normalize( vWorldPosition + offset ).y;
	gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h, 0.0 ), exponent ), 0.0 ) ), 1.0 );

}
`

function createSkyMaterial(){
	var uniforms = {
		topColor:    { value: new THREE.Color( 0x1a1b33) },
		bottomColor: { value: new THREE.Color( 0x1A2D32) },
		offset:      { value: 33 },
		exponent:    { value: 0.6 }
	};
	var skyMat = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		side: THREE.DoubleSide,
	} );
	return skyMat;


}

// function colorTheFog(position,path){

// //r
// //g
// //b
// 	var r, g, b;
// 	if(path===0){
		
// 	}
// }