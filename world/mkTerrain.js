function mkTerrain(paths,width,height) {


    // paths=new Float32Array([
    //     1,0.2,1,1,
    //     0,0,0,0,
    //     1,1,0.4,1,
    //     0,0,0,0
    // ])
    // //assuming it's a square
    // var size=Math.sqrt(paths.length);
    // map = new THREE.DataTexture(paths,
    //     size, size,
    //     THREE.AlphaFormat,
    //     THREE.FloatType );
    // map.needsUpdate = true;

    //needs to be a rectangle
    //ideally a square whose side is power of 2
    var width=6
    var height=4;
    paths=new Float32Array([
        1,0.2,1,1,.3,.6,
        0,0,0,0,.5,.7,
        1,1,0.4,1,0,.9,
        0,0,0,0,0,0
    ])
    map = new THREE.DataTexture(paths,
        width,height,
        THREE.AlphaFormat,
        THREE.FloatType );
    map.needsUpdate = true;

    material = new THREE.ShaderMaterial({
        uniforms: {
            map: {
                type: "t",
                value: map
            }
        },
        vertexShader: vertexShader,

        fragmentShader: fragmentShader,
    })
    var geometry = new THREE.PlaneBufferGeometry(400, 400, 256, 256);
    mesh = new THREE.Mesh( geometry, material );
    return mesh
}