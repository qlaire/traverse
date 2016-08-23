var skyBox;

function addSky(){
	var geometry = new THREE.SphereGeometry(2000, 60, 60);  
	var material=createSkyMaterial();
	skyBox = new THREE.Mesh(geometry, material);  
	console.log(skyBox);
	skyBox.scale.set(-1, 1, 1);  
	skyBox.eulerOrder = 'XZY';  
	skyBox.renderDepth = 1900.0;  
	scene.add(skyBox); 
	skyBox.rotation.y = -Math.PI/2;
	scene.fog = new THREE.FogExp2( 0x1A2D32, 0.0005 );

}

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