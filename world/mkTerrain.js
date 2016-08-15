// function mkTerrain(paths,width,height) {
//     var width=6
//     var height=4;
//     paths=new Float32Array([
//         1,0.2,1,1,.3,.6,
//         0,0,0,0,.5,.7,
//         1,1,0.4,1,0,.9,
//         0,0,0,0,0,0
//     ])
//     map = new THREE.DataTexture(paths,
//         width,height,
//         THREE.AlphaFormat,
//         THREE.FloatType );
//     map.needsUpdate = true;

//     material = new THREE.ShaderMaterial({
//         uniforms: {
//             map: {
//                 type: "t",
//                 value: map
//             }
//         },
//         vertexShader: vertexShader,

//         fragmentShader: fragmentShader,
//     })
//     //material.side=THREE.DoubleSide; //necessary??
//     var geometry = new THREE.PlaneBufferGeometry(2000, 2000, 32, 32); //orig 256
//     mesh = new THREE.Mesh( geometry, material );
//     mesh.rotation.x = -Math.PI / 2;
//     //THREE.GeometryUtils.merge(geometry, mesh)  MAYBE?!?!
//     return mesh
// }


function magnifyArray(arr, scale) {
    var res = [];
    if(!arr.length)
        return arr;
    for (var i = 0; i < arr.length; i++) {
        var temp = magnifyArray(arr[i], scale);
        for (var k = 0; k < scale; k++) {
            res.push(temp.slice ? temp.slice(0) : temp);
        }
    }
    return res;
}


function makeTerrain(paths){
    var paths=[[0,0,0,.5,.6,.4,.5,.1,.9],
                [.2,.3,.9,.2,.6,.1,.1,.2,.3],
                [.4,.5,.1,.7,.9,.2,.3,.5,.4],
                [.9,.8,.2,.3,.6,.8,1,.5,.4],
                [1,1,1,1,1,1,1,1,1],
                [.3,.5,.4,.8,.9,.3,.3,.5,.4],
                [.9,.8,.1,.3,.6,.7,1,.5,.4],
                [1,1,1,1,.5,.4,.1,.7,.9],
                [.9,.9,.7,.3,.7,.7,1,.5,.4]] 
    var scaleUp=4;
    var wS=(paths[0].length*scaleUp)-1;
    var hS=(paths.length*scaleUp)-1;
    var geometry = new THREE.PlaneGeometry(paths.length*300,paths[0].length*300, wS, hS);
    var material = new THREE.MeshLambertMaterial({ color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading });
    var radius=2;
    var distance;
    var scaledArr=magnifyArray(paths,scaleUp);
    console.log(scaledArr);
    var neighbors;
    var newVal;
    var smoothedArr=[];
    for(var r=0;r<scaledArr.length;r++){
        for(var c=0;c<scaledArr[0].length;c++){
            neighbors=[];
            for(var i=-radius;i<radius;i++){
                for(var j=-radius;j<radius;j++){
                    if(i===0&&j===0){
                        neighbors.push(scaledArr[r][c]*10)
                    }
                    else if(scaledArr[r+i]&&scaledArr[r+i][c+j]){
                        distance=Math.sqrt(Math.pow(i,2)+Math.pow(j,2));
                        neighbors.push(scaledArr[r+i][c+j]*(1/distance));
                    }
                }
            }
            newVal=findMean(neighbors);
            if(!smoothedArr[r]){
                smoothedArr[r]=[];
            }
            smoothedArr[r][c]=newVal;
        }

    }
    var flattenedArr=[];
    for(var i=0;i<smoothedArr.length;i++){
        flattenedArr=flattenedArr.concat(smoothedArr[i]);
    }
    console.log('flattenedArr',flattenedArr);
    for(var i=0; i<geometry.vertices.length; i++){
        geometry.vertices[i].z =  flattenedArr[i]*300;
    }
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    var plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;

    return plane
}
function findMean(arr){
    var sum=0;
    arr.forEach(function(item){
        sum+=item;
    })
    return sum/arr.length;
}