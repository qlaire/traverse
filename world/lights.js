function mainLights(){
    var dirLight = new THREE.DirectionalLight(0xE6D8AF, .1);
    dirLight.position.set(0, 200, 0);
    scene.add(dirLight);
    console.log(dirLight);
}


function randomXInEmotion(emotion){
	var bound1, bound2;
	if(emotion==='anger'){
		bound1=zZones[2];
		bound2=zZones[1];	

	}
	if(emotion==='joy'||emotion=='sadness'){
		bound1=zZones[1];
		bound2=zZones[0];	
	}
	if(emotion==='fear'){
		bound1=zZones[0];
		 bound2=zZones[999];	

	}
	var xCoord=bound1+(Math.random()*(bound2-bound1));
	return 	xCoord;
}



var pointLights;
function pointLights(){
	pointLights=[];
	console.log('zZones and xZones')
	console.log(zZones);
	console.log(xZones);
	var emotionToLightColor={'anger':0xA8263F,'joy':0xFDAA43,'fear':0x3B3F78};
	var xCoord;
	var color;
	var emotions=Object.keys(emotionToLightColor);
	for(var i=0; i<emotions.length; i++){
		for(var j=0; j<Object.keys(xZones).length; j++){
			xCoord=randomXInEmotion(emotions[i]);
			var color=emotionToLightColor[emotions[i]];
			pointLights.push(singlePointLight(xZones[j],Math.random()*200,xCoord,color,color));	
		}		
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