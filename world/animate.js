function animate(PicsFactory) {
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
    //animateOrbitControls();
    animatePointerLockControls(PicsFactory);
    animatePointLights();
    animateWords();
    //composer.render();
}
