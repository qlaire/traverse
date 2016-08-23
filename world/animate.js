function animate() {
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
    animatePointerLockControls();
    animatePointLights();
	animateSingleWords();
	animateEntries();
}