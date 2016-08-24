function animate(ts) {
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
    animatePointerLockControls();
    animatePointLights();
	animateSingleWords();
	animateEntries();
    columnUpdate(ts);
}