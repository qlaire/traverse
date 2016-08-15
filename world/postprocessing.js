var composer,effect;
function postProcess(){
		composer = new THREE.EffectComposer( renderer );
		composer.addPass( new THREE.RenderPass( scene, camera ) );

		effect = new THREE.ShaderPass( THREE.ColorifyShader );
		effect.uniforms[ 'color' ].value = new THREE.Color( 0x4da6ff);
		console.log(effect);
		effect.renderToScreen=true;
		composer.addPass( effect );

		// var effect2 = new THREE.ShaderPass( THREE.FilmShader );
		// effect2.renderToScreen=true;
		// composer.addPass( effect2 );

		// var effect = new THREE.ShaderPass( THREE.DotScreenShader );
		// effect.uniforms[ 'scale' ].value = 4;
		// composer.addPass( effect );

		// var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
		// effect.uniforms[ 'amount' ].value = 0.0015;
		// effect.renderToScreen = true;
		//composer.addPass( effect );
}