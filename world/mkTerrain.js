

var xBound;
var zBound;
var paddingX;
var paddingZ;
var vertexDict;
var distanceX, distanceY;

function makeTerrain(paths){
    //TODO: REFACTOR LIKE HELLLLLLLL1
    var paddingSize=5;
    var scaleUp=4;
    var smoothingRadius=2;
    //TODO: Make sure we can get this from outside;
    var paths=[ [ '0.3', '0.4', '0.2', '0.3', '0.3', '0.7', '0.3', '0.3', '0.3', '0.5', '0.5', '0.1', '0.6', '0.4', '0.1', '0.3', '0.3', '0.7', '0.8', '0.8', '0.8', '0.5', '0.8', '0.8', '0.3', '0.7', '0.6', '0.7', '0.7', '0.4' ],
  [ '0.1', '0.1', '0.1', '0.2', '0.1', '0.3', '0.1', '0.1', '0.0', '0.3', '0.4', '0.3', '0.1', '0.3', '0.1', '0.3', '0.2', '0.4', '0.1', '0.2', '0.0', '0.4', '0.2', '0.2', '0.2', '0.2', '0.3', '0.2', '0.0', '0.4' ],
  [ '0.2', '0.1', '0.5', '0.2', '0.3', '0.0', '0.2', '0.4', '0.8', '0.0', '0.0', '0.3', '0.0', '0.1', '0.6', '0.4', '0.3', '0.0', '0.0', '0.0', '0.0', '0.1', '0.0', '0.0', '0.1', '0.0', '0.0', '0.0', '0.0', '0.1' ] ]

    var terrainData=generateTerrainData(paths,paddingSize,scaleUp,smoothingRadius);
    //unpack
    var flattenedArr=terrainData.flattenedArr;
    var helperArrFlat=terrainData.helperArrFlat;
    var wS=terrainData.wS;
    var hS=terrainData.hS;
    var terrainWidth=terrainData.terrainWidth;
    var terrainHeight=terrainData.terrainHeight;
    paddingX=terrainData.paddingX;
    paddingZ=terrainData.paddingZ;
    xBound=terrainData.xBound;
    zBound=terrainData.zBound;
    scaledArr=terrainData.scaledArr;

    return generateGeometry(terrainWidth,terrainHeight,wS,hS,scaledArr,flattenedArr,helperArrFlat)

}

function generateGeometry(terrainWidth,terrainHeight,wS,hS,scaledArr,flattenedArr,helperArrFlat){
    var geometry = new THREE.PlaneGeometry(terrainWidth,terrainHeight,wS,hS);
    var material = new THREE.MeshLambertMaterial({ color: 0xdddddd, shading: THREE.FlatShading });
    vertexDict={};
    var vertexDictX;
    var vertexDictY;
    distanceX=Math.abs(Math.round(geometry.vertices[1].x-geometry.vertices[0].x));
    distanceY=Math.abs(Math.round(geometry.vertices[scaledArr[0].length].y-geometry.vertices[0].y));
    var xZones={};
    var yZones={};
    for(var i=0; i<geometry.vertices.length; i++){
        geometry.vertices[i].z =  flattenedArr[i]*150;
        vertexDictX=customFloor(geometry.vertices[i].x,distanceX);
        vertexDictY=customFloor(geometry.vertices[i].y,distanceY);
        vertexDict[[vertexDictX,vertexDictY]]=[helperArrFlat[i][0],helperArrFlat[i][helperArrFlat[i].length-1]];
        //seems to work, but missing one of the padding zones
        if(!xZones[helperArrFlat[i][0]]){
            xZones[helperArrFlat[i][0]]=vertexDictY;
        }
        else if(vertexDictY<xZones[helperArrFlat[i][0]]){
            xZones[helperArrFlat[i][0]]=vertexDictY;
        }
        if(!yZones[helperArrFlat[i][helperArrFlat[i].length-1]]){
            yZones[helperArrFlat[i][helperArrFlat[i].length-1]]=vertexDictX;            
        }
        else if(vertexDictX<yZones[helperArrFlat[i][helperArrFlat[i].length-1]]){
            yZones[helperArrFlat[i][helperArrFlat[i].length-1]]=vertexDictX;
        }
    }
    console.log(xZones);
    console.log(yZones);
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    var plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    return plane


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
    var terrainWidth=paths.length*200;
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


