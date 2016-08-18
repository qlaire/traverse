function animate() {
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
    //animateOrbitControls();
    animatePointerLockControls();
    animatePointLights();
    animateWords();
    //composer.render();
}