function animate() {
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
    controls.update();
}