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

function padArray(arr,paddingSize,paddingElt){
  //pad beginnings and ends of rows
  for(var i=0;i<arr.length;i++){
    for(var j=0;j<paddingSize;j++){
      arr[i].unshift(paddingElt||0);
      arr[i].push(paddingElt||0)
    } 
  }
  //pad top and bottom
  arrOfZero=[];
  for(var i=0;i<arr[0].length;i++){
    arrOfZero.push(paddingElt||0);
  }
  for(var i=0;i<paddingSize;i++){
    arr.unshift(arrOfZero);
    arr.push(arrOfZero)
  }

}

var xBound;
var zBound;
var zoneWidth;
var entryDepth;
var paddingX;
var paddingZ;
var zoneMarkers=[];
var entryMarkers=[];
var vertexDict;
// var wS; //maybe take these back to local scope!!!
// var hS;
var distanceX, distanceY;

function makeTerrain(paths){
    //TODO: REFACTOR LIKE HELLLLLLLL1
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
    // var paths=[[1,.5,.7,.2,.9,.8,.4,.1,0,0,.2,0,1,0,1,.2,.4,.6,.6,1],
    //     [1,.1,.5,.8,.5,.5,.6,.5,.5,.5,.5,.7,.5,.5,.1,.5,.5,.9,.5,0],
    //     [1,0,0,0,0,0,0,.4,0,.3,.2,0,0,0,0,0,0,0,0,1]]
    var paths=[ [ '0.3', '0.4', '0.2', '0.3', '0.3', '0.7', '0.3', '0.3', '0.3', '0.5', '0.5', '0.1', '0.6', '0.4', '0.1', '0.3', '0.3', '0.7', '0.8', '0.8', '0.8', '0.5', '0.8', '0.8', '0.3', '0.7', '0.6', '0.7', '0.7', '0.4' ],
  [ '0.1', '0.1', '0.1', '0.2', '0.1', '0.3', '0.1', '0.1', '0.0', '0.3', '0.4', '0.3', '0.1', '0.3', '0.1', '0.3', '0.2', '0.4', '0.1', '0.2', '0.0', '0.4', '0.2', '0.2', '0.2', '0.2', '0.3', '0.2', '0.0', '0.4' ],
  [ '0.2', '0.1', '0.5', '0.2', '0.3', '0.0', '0.2', '0.4', '0.8', '0.0', '0.0', '0.3', '0.0', '0.1', '0.6', '0.4', '0.3', '0.0', '0.0', '0.0', '0.0', '0.1', '0.0', '0.0', '0.1', '0.0', '0.0', '0.0', '0.0', '0.1' ] ]
    for(var i=0;i<paths.length;i++){
        for(j=0;j<paths[0].length;j++){
            paths[i][j]=Number(paths[i][j])
        }
    }
    console.log(paths);
    // var paths=[[1,1,1,1,1],
    //     [0,0,0,0,0],
    //     [1,1,1,1,1]]

    //helperArr goes through identifical transformations as paths, but saves
    //vital data about it
    var helperArr=[];
    for(var i=0;i<paths.length;i++){
        for(var j=0; j<paths[0].length;j++){
            if(!helperArr[i]){
                helperArr[i]=[];
            }
            helperArr[i][j]=[i,j]; //represents which path it's on + which index in orig
        }
    }
    padArray(paths,paddingSize);
    padArray(helperArr,paddingSize,[-1,-1]);
    //console.log(helperArr);


    var scaleUp=4;
    var wS=(paths[0].length*scaleUp)-1;
    var hS=(paths.length*scaleUp)-1;
    console.log('wS x hS',wS,hS);

    //height should be smaller
    //one bound is terrain width/2 x terrain height/2
    //the other is negative of that

    //TODO: width and height change according to array dimensions NONLINEARLY
    var terrainWidth=paths.length*200;
    var terrainHeight=paths[0].length*200;
    //console.log('width x height',terrainWidth,terrainHeight)

    //IT'S POSSIBLE tHESE ARE SWITCHED AROUND
    paddingX=(paddingSize/(paths[0].length+paddingSize))*terrainWidth;
    paddingZ=(paddingSize/(paths.length+paddingSize))*terrainHeight;
    xBound=terrainWidth/2-(paddingX/2);
    zBound=terrainHeight/2-(paddingZ/2);

    //CREATE path zones
    zoneWidth=(terrainHeight-(2*paddingZ))/3;
    zoneMarkers[0]=(-terrainHeight/2)+paddingZ;
    zoneMarkers[1]=zoneMarkers[0]+zoneWidth;
    zoneMarkers[2]=zoneMarkers[1]+zoneWidth;
    zoneMarkers[3]=zoneMarkers[2]+zoneWidth;
    zoneMarkers[1]+=(zoneWidth/4);
    zoneMarkers[2]-=(zoneWidth/4);
    zoneMarkers[0]+=(zoneWidth/3);
    zoneMarkers[3]-=(zoneWidth/3);
    //console.log(zoneMarkers);
    //CREATE journal entry zones
    entryDepth=((terrainWidth-(2*paddingX))/paths[0].length);
    //console.log(entryDepth);
    entryMarkers[0]=(terrainWidth/2)-paddingX;
    for (var i=1; i<paths[0].length; i++){
        entryMarkers.push(entryMarkers[i-1]+entryDepth);
    }


    var geometry = new THREE.PlaneGeometry(terrainWidth,terrainHeight, wS, hS);
    var material = new THREE.MeshLambertMaterial({ color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading });
    var radius=2;
    var distance;
    //console.log('before magnifying',helperArr);

    var scaledArr=magnifyArray(paths,scaleUp);
    var helperArr=magnifyArray(helperArr,scaleUp);
    //console.log('after magnifying',helperArr);

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
    //omg dry this up
    var flattenedArr=[];
    for(var i=0;i<smoothedArr.length;i++){
        flattenedArr=flattenedArr.concat(smoothedArr[i]);
    }
    var helperArrFlat=[];
    for(var i=0;i<helperArr.length;i++){
        helperArrFlat=helperArrFlat.concat(helperArr[i]);
    }
    vertexDict={};
    //WHEEE OMG SO CLOSE JUST DO SOME MATH
    var vertexDictX;
    var vertexDictY;
    //need to get distance between xCoords of vertices = 22
    //need to get distance between yCoords of vertices = 118
    distanceX=Math.abs(Math.round(geometry.vertices[1].x-geometry.vertices[0].x));
    distanceY=Math.abs(Math.round(geometry.vertices[scaledArr[0].length].y-geometry.vertices[0].y));
    console.log('DISTANCE_X',distanceX);
    console.log('distance y',distanceY)
    for(var i=0; i<geometry.vertices.length; i++){
        //if(geometry.vertices[i-1]) console.log(geometry.vertices[i].x-geometry.vertices[i-1].x);
        geometry.vertices[i].z =  flattenedArr[i]*150;
        vertexDictX=customFloor(geometry.vertices[i].x,distanceX);
        vertexDictY=customFloor(geometry.vertices[i].y,distanceY);
        vertexDict[[vertexDictX,vertexDictY]]=helperArrFlat[i];
        if(i>100&&i<200){
            console.log(vertexDictX,vertexDictY)
            console.log(vertexDict[[vertexDictX,vertexDictY]]);
        }
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

function customFloor(num,factor){
  return factor * Math.floor(num/factor);
}

