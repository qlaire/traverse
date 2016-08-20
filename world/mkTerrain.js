

var xBound;
var zBound;
var paddingX;
var paddingZ;
var vertexDict;
var distanceX, distanceY;
var zZones,xZones;
var terrainWidth;
var terrainHeight;

function makeTerrain(paths){
    var paddingSize=5;
    var scaleUp=4;
    var smoothingRadius=3;
    //TODO: Make sure we can get this from outside;
    var paths=worldData.emoScores;
       //anger, joy, fear
    //higher number -> higher emotion
    var terrainData=generateTerrainData(paths,paddingSize,scaleUp,smoothingRadius);
    //unpack
    var flattenedArr=terrainData.flattenedArr;
    var helperArrFlat=terrainData.helperArrFlat;
    var wS=terrainData.wS;
    var hS=terrainData.hS;
    terrainWidth=terrainData.terrainWidth;
    terrainHeight=terrainData.terrainHeight;
    paddingX=terrainData.paddingX;
    paddingZ=terrainData.paddingZ;
    xBound=terrainData.xBound;
    zBound=terrainData.zBound;
    scaledArr=terrainData.scaledArr;

    return generateGeometry(terrainWidth,terrainHeight,wS,hS,scaledArr,flattenedArr,helperArrFlat)

}

function makeBase(terrainWidth,terrainHeight,material){
    var geometry = new THREE.PlaneGeometry(terrainWidth*2,terrainHeight*2,1,1);
    //should make the same as in generateGemoetry()
    // var material = new THREE.MeshLambertMaterial({ color: 'red', shading: THREE.FlatShading }); 
    var plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y=-1;
}

function generateGeometry(terrainWidth,terrainHeight,wS,hS,scaledArr,flattenedArr,helperArrFlat){
    var geometry = new THREE.PlaneGeometry(terrainWidth,terrainHeight,wS,hS);
    var texture=THREE.ImageUtils.loadTexture('assets/dirt2.png')
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 200;
    texture.repeat.y = 200;
    var material = new THREE.MeshLambertMaterial({ color: '0x8493b5', shading: THREE.FlatShading, map: texture});
    vertexDict={};
    var vertexDictX;
    var vertexDictY;
    distanceX=Math.abs(Math.round(geometry.vertices[1].x-geometry.vertices[0].x));
    distanceY=Math.abs(Math.round(geometry.vertices[scaledArr[0].length].y-geometry.vertices[0].y));
    zZones={};
    xZones={};
    var updatedDict
    for(var i=0; i<geometry.vertices.length; i++){
        geometry.vertices[i].z =  flattenedArr[i]*200;
    }
    buildZonesDict(zZones,xZones,vertexDictX,vertexDictY,helperArrFlat,geometry,i);
    //final touches
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    var plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    makeBase(terrainWidth,terrainHeight,material);
    return plane
}

function buildZonesDict(zZones,xZones,vertexDictX,vertexDictY,helperArrFlat,geometry){
        for(var i=0; i<geometry.vertices.length; i++){
            vertexDictX=customFloor(geometry.vertices[i].x,distanceX);
            vertexDictY=customFloor(geometry.vertices[i].y,distanceY);
            vertexDict[[vertexDictX,vertexDictY]]=[helperArrFlat[i][0],helperArrFlat[i][helperArrFlat[i].length-1]];

            if(!zZones[helperArrFlat[i][0]]){
                zZones[helperArrFlat[i][0]]=vertexDictY;
            }
            else if(vertexDictY<zZones[helperArrFlat[i][0]]){
                zZones[helperArrFlat[i][0]]=vertexDictY;
            }

            if(!xZones[helperArrFlat[i][helperArrFlat[i].length-1]]){
                xZones[helperArrFlat[i][helperArrFlat[i].length-1]]=vertexDictX;            
            }
            else if(vertexDictX<xZones[helperArrFlat[i][helperArrFlat[i].length-1]]){
                xZones[helperArrFlat[i][helperArrFlat[i].length-1]]=vertexDictX;
            }
        }
        //get last padding zones
        var toAdd=zZones[0]-zZones[1];
        zZones[999]=zZones[0]+toAdd;
        zZones[-1] = zZones[2] - toAdd;
        var keys=Object.keys(xZones);
        toAdd=xZones[1]-xZones[0];
        xZones[999]=xZones[keys.length-2]+toAdd;
        xZones[-1] = xZones[0] - toAdd;
        // console.log(zZones,xZones)
}
function generateTerrainData(paths,paddingSize,scaleUp,smoothingRadius){
    //numify
    paths=numifyData(paths);

    //create helper
    var helperArr=generateHelperArr(paths);
    //pad both
    padArray(paths,paddingSize);
    padArray(helperArr,paddingSize,[-1,-1]);
    //get terrainWidth and terrainHeight
    var terrainWidth=paths.length*250;
    var terrainHeight=paths[0].length*200;
    //get wS and hS
    var wS=(paths[0].length*scaleUp)-1;
    var hS=(paths.length*scaleUp)-1;
    //padding and bounds
    var paddingX=(paddingSize/(paths[0].length+paddingSize))*terrainWidth;
    var paddingZ=(paddingSize/(paths.length+paddingSize))*terrainHeight;
    var xBound=terrainWidth/2-(paddingX/2);
    var zBound=terrainHeight/2-(paddingZ/2);
    //magnify
    var scaledArr=magnifyArray(paths,scaleUp);
    var helperArr=magnifyArray(helperArr,scaleUp);
    //smooth
    var smoothedArr=smoothArray(scaledArr,smoothingRadius);
    //flatten
    var flattenedArr=flattenArray(smoothedArr);
    var helperArrFlat=flattenArray(helperArr);

    return {flattenedArr: flattenedArr, scaledArr:scaledArr, helperArrFlat:helperArrFlat,wS:wS,hS:hS,terrainWidth:terrainWidth, terrainHeight:terrainHeight, paddingX:paddingX, paddingZ:paddingZ,xBound:xBound,zBound:zBound};

}

function flattenArray(array){
    var flattenedArr=[];
    for(var i=0;i<array.length;i++){
        flattenedArr=flattenedArr.concat(array[i]);
    } 
    return flattenedArr;   
}
function smoothArray(scaledArr,radius){
    var neighbors;
    var newVal;
    var distance;
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
    return smoothedArr;
}

function generateHelperArr(paths){
    var helperArr=[];
    for(var i=0;i<paths.length;i++){
        for(var j=0; j<paths[0].length;j++){
            if(!helperArr[i]){
                helperArr[i]=[];
            }
            helperArr[i][j]=[i,j]; 
        }
    }
    return helperArr;
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

function numifyData(array){
    if(typeof array[0] === 'Number'){
        return array;
    }
    for(var i=0;i<array.length;i++){
        for(j=0;j<array[0].length;j++){
            array[i][j]=Number(array[i][j])
        }
    }
    return array;
}

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


