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

// function padArray(arr,paddingSize){
//   var toUnshift, toPush;
//   //pad beginnings and ends of rows
//   for(var i=0;i<arr.length;i++){
//     for(var j=0;j<paddingSize;j++){
//       toUnshift=arr[i][0];
//       arr[i].unshift(toUnshift);
//       toPush=arr[i][arr.length-1];
//       arr[i].push(toPush)
//     } 
//   }
//   //pad top and bottom
//   for(var i=0;i<paddingSize;i++){
//     arr.unshift(arr[0]);
//     arr.push(arr[arr.length-1])
//   }
// }

function padArray(arr,paddingSize){
  //pad beginnings and ends of rows
  for(var i=0;i<arr.length;i++){
    for(var j=0;j<paddingSize;j++){
      arr[i].unshift(0);
      arr[i].push(0)
    } 
  }
  //pad top and bottom
  arrOfZero=[];
  for(var i=0;i<arr[0].length;i++){
    arrOfZero.push(0);
  }
  for(var i=0;i<paddingSize;i++){
    arr.unshift(arrOfZero);
    arr.push(arrOfZero)
  }

}

var xBound;
var zBound;
var zoneWidth;
var paddingX;
var paddingZ;
var zoneMarkers=[];
function makeTerrain(paths){
    var paddingSize=5;
    // var paths=[[0,0,0,.5,.6,.4,.5,.1,.9],
    //             [.2,.3,.9,.2,.6,.1,.1,.2,.3],
    //             [.4,.5,.1,.7,.9,.2,.3,.5,.4],
    //             [.9,.8,.2,.3,.6,.8,1,.5,.4],
    //             [1,1,1,1,1,1,1,1,1],
    //             [.3,.5,.4,.8,.9,.3,.3,.5,.4],
    //             [.9,.8,.1,.3,.6,.7,1,.5,.4],
    //             [1,1,1,1,.5,.4,.1,.7,.9],
    //             [.9,.9,.7,.3,.7,.7,1,.5,.4]] 
    // var paths=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    //         [.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5],
    //         [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
    
    //YOU START AT THE END
    var paths=[[1,.5,.7,.2,.9,.8,.4,.1,0,0,.2,0,1,0,1,.2,.4,.6,.6,1],
        [1,.1,.5,.8,.5,.5,.6,.5,.5,.5,.5,.7,.5,.5,.1,.5,.5,.9,.5,0],
        [1,0,0,0,0,0,0,.4,0,.3,.2,0,0,0,0,0,0,0,0,1]]
    // var paths=[[1,1,1,1,1],
    //     [0,0,0,0,0],
    //     [1,1,1,1,1]]
    padArray(paths,paddingSize);
    var scaleUp=4;
    var wS=(paths[0].length*scaleUp)-1;
    var hS=(paths.length*scaleUp)-1;
    //height should be smaller
    //one bound is terrain width/2 x terrain height/2
    //the other is negative of that

    //TODO: width and height change according to array dimensions NONLINEARLY
    var terrainWidth=paths.length*200;
    var terrainHeight=paths[0].length*200;

    //IT'S POSSIBLE tHESE ARE SWITCHED AROUND
    paddingX=(paddingSize/(paths[0].length+paddingSize))*terrainWidth;
    paddingZ=(paddingSize/(paths.length+paddingSize))*terrainHeight;
    xBound=terrainWidth/2-(paddingX/2);
    zBound=terrainHeight/2-(paddingZ/2);

    //adjust these!!!
    zoneWidth=(terrainHeight-(2*paddingZ))/3;
    zoneMarkers[0]=(-terrainHeight/2)+paddingZ;
    zoneMarkers[1]=zoneMarkers[0]+zoneWidth;
    zoneMarkers[2]=zoneMarkers[1]+zoneWidth;
    zoneMarkers[3]=zoneMarkers[2]+zoneWidth;
    zoneMarkers[1]+=(zoneWidth/4);
    zoneMarkers[2]-=(zoneWidth/4);
    zoneMarkers[0]+=(zoneWidth/3);
    zoneMarkers[3]-=(zoneWidth/3);
    console.log(zoneMarkers);

    (zBound*2)/3; //BECAUSE THERE ARE THREE PATHS!!!!
    console.log('zoneWidth',zoneWidth);


    console.log('zBound',zBound);
    console.log('-zBound+paddingZ',-zBound+paddingZ);

    var geometry = new THREE.PlaneGeometry(terrainWidth,terrainHeight, wS, hS);
    var material = new THREE.MeshLambertMaterial({ color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading });
    var radius=2;
    var distance;
    var scaledArr=magnifyArray(paths,scaleUp);
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
    for(var i=0; i<geometry.vertices.length; i++){
        geometry.vertices[i].z =  flattenedArr[i]*150;
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