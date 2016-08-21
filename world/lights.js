function mainLights(){
    var dirLight = new THREE.DirectionalLight(0xE6D8AF, .1);
    dirLight.position.set(0, 200, 0);
    scene.add(dirLight);
    console.log(dirLight);
}

var pointLights;
function pointLights(){
	console.log('zZones and xZones')
	console.log(zZones);
	console.log(xZones);
	pointLights=[];

	//PATH 0 - ANGER
	console.log(Object.keys(zZones));
	var bound1=zZones[2];
	var bound2=zZones[1];
	var xCoord;
	for(var i=0; i<Object.keys(xZones).length; i++){
		xCoord=bound1+(Math.random()*(bound2-bound1));
		pointLights.push(singlePointLight(xZones[i],Math.random()*200,xCoord,0xA8263F,0xA8263F));	
	}

	//PATH 1 - JOY
	console.log(Object.keys(zZones));
	var bound1=zZones[1];
	var bound2=zZones[0];
	var xCoord;
	for(var i=0; i<Object.keys(xZones).length; i++){
		xCoord=bound1+(Math.random()*(bound2-bound1));
		pointLights.push(singlePointLight(xZones[i],Math.random()*200,xCoord,0xFDAA43,0xFDAA43));
	}

	//PATH 2 - FEAR
	console.log(Object.keys(zZones));
	var bound1=zZones[0];
	var bound2=zZones[999];
	var xCoord;
	for(var i=0; i<Object.keys(xZones).length; i++){
		xCoord=bound1+(Math.random()*(bound2-bound1));
		pointLights.push(singlePointLight(xZones[i],Math.random()*200,xCoord,0x3B3F78, 0x3B3F78
));
	}

}


function singlePointLight(x,y,z,lightColor,meshColor){
	var geometry = new THREE.SphereGeometry(.6,32,32 );
	var material=new THREE.MeshBasicMaterial( {color: meshColor} )
	var sphere = new THREE.Mesh( geometry, material );
	sphere.position.set(x,y,z);
	scene.add( sphere);

	var point = new THREE.PointLight(lightColor, .8, 150);
	// point.position.set( x,y,z );
	sphere.add(point);

	geometry = new THREE.SphereGeometry(.7,32,32 );
	// var material = new THREE.MeshBasicMaterial( {color: meshColor} );
	material=getGlowMaterial();
	var glow = new THREE.Mesh( geometry, material );
	// sphere.position.set(x,y,z);
	sphere.add( glow );

	return sphere;
	//scene.add(new THREE.PointLightHelper(point, 3));
}


var vertexShaderGlow=
`
varying vec3 vNormal;
void main() 
{
    vNormal = normalize( normalMatrix * normal );
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`
var fragmentShaderGlow=
`
varying vec3 vNormal;
void main() 
{
	float intensity = pow( 0.7 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 4.0 ); 
    gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;
}
`
function getGlowMaterial(){
	return customMaterial = new THREE.ShaderMaterial( 
	{
	    uniforms: {  },
		vertexShader:   vertexShaderGlow,
		fragmentShader: fragmentShaderGlow,
		side: THREE.BackSide,
		blending: THREE.AdditiveBlending,
		transparent: true
	}   );

}

function animatePointLights(){
	for(var i=0; i<pointLights.length; i++){
		pointLights[i].rotation.x+=.01;
		pointLights[i].rotation.y+=.01;
		pointLights[i].rotation.z+=.01;
	}
}