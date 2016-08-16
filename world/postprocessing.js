var composer,effect;
function postProcess(){
		composer = new THREE.EffectComposer( renderer );
		composer.addPass( new THREE.RenderPass( scene, camera ) );

		effect = new THREE.ShaderPass( THREE.ColorifyShader );
		effect.uniforms[ 'color' ].value = new THREE.Color( 0xffffff);
		effect.renderToScreen=true;
		composer.addPass( effect );

		// effect2 = new THREE.ShaderPass( THREE.FilmShader );
		// effect2.renderToScreen=true;
		// composer.addPass( effect2 );
}

function renderColors(currPosition){

		if(raycount%100===0){
			console.log(currPosition.z);
			console.log(zoneMarkers)
		}
		if(currPosition.z>=(zoneMarkers[0])&&currPosition.z<(zoneMarkers[1])){
			console.log('zone 1')
			effect.uniforms[ 'color' ].value = new THREE.Color(0xcc66ff); //purple
		}
		else if(currPosition.z>=(zoneMarkers[1])&&currPosition.z<(zoneMarkers[2])){
			console.log('zone2')
			effect.uniforms[ 'color'].value = new THREE.Color(0xff0000); //red
		}			
		else if(currPosition.z>=(zoneMarkers[2])&&currPosition.z<(zoneMarkers[3])){
			console.log('zone3')
			effect.uniforms[ 'color' ].value = new THREE.Color(0x33cc33); //green
		}
		else{
			effect.uniforms[ 'color' ].value = new THREE.Color( 0xffffff);
	
		}
}