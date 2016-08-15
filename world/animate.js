function animate() {
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
    //animateOrbitControls();
    animatePointerLockControls();
    composer.render();
}