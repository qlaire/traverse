/*NOTES FOR IMPROVEMENT: Back these variables into a single object*/
var globalTerrainData={};

var xBound;
var zBound;
var paddingX;
var paddingZ;
var vertexDict;
var distanceX, distanceY;
var zZones,xZones;
var terrainWidth;
var terrainHeight;

/*Generates the terrain based on worldData.emoScores - a 2D array representing emotional intensity over time. Each value represents the emotioal intensity for one chunk of a journal entry (1-3 chunks per entry) e.g.
    [
        [1,.5,1,.3], //anger (over time)
        [0,.6,.2,.1], //joy (over time)
        [.5,1,0,1] //fear (over time)
    ]
 */
function makeTerrain(){
    //Parameters
    var paddingSize=5;
    var scaleUp=4;
    var smoothingRadius=3;
    //Get terrain data
    var terrainData=generateTerrainData(worldData.emoScores,paddingSize,scaleUp,smoothingRadius);
    //Unpack terrain data
    var flattenedArr=terrainData.flattenedArr;
    var helperArrFlat=terrainData.helperArrFlat;
    var wS=terrainData.wS;
    var hS=terrainData.hS;
    var numChunks=terrainData.numChunks;
    //Set variables in outer scope
    terrainWidth=terrainData.terrainWidth;
    terrainHeight=terrainData.terrainHeight;
    paddingX=terrainData.paddingX;
    paddingZ=terrainData.paddingZ;
    xBound=terrainData.xBound;
    zBound=terrainData.zBound;
    //Generate and return mesh
    return generateMesh(terrainWidth,terrainHeight,wS,hS,numChunks,flattenedArr,helperArrFlat)

}

/*
Takes worldData.emoScores and generates a bundle of usable data:

    flattenedArr (array) -A version of emoScores that is magnified, padded, smoothed and flattened so that it maps to the correct number of veritices for the terrain - later used to generate geometry. In sum, a 1d array in which each element represents the height of the vertex, as derived from the emotional score. 

    helperArrFlat (array) - A helper array of the dimensions of flattenedArr. However, instead of containing the emotional score, each element contains at array with the original 2d coordinates [pathNum,chunkNum]. So an entry marked [0,5] corresponds to the anger path (0) and the 5th chunk of text.

    numChunks (Number) - the total number of chunks (of journal entries) used to generate the terrain

    wS and hS (Numbers) - the width and height of the segments that will connect the vertices in the terrain

    terrainWidth and terrainHeight (Numbers) - height and width of the terrain

    paddingX and paddingZ (Numbers) - the padding on the terrain that will be generated, in X (left/right from camera) and Z (forward/back) dimensions

    xBound, zBound (Numbers) - These numbers and their negatives represent the location of the invisible wall that will stop the player from going too far from the interesting part of the terrain.

*/
function generateTerrainData(emoScores,paddingSize,scaleUp,smoothingRadius){
    //Make sure emoScores contains only numbers
    emoScores=numifyData(emoScores);
    //Create a helper array that will undergo the same transformations as the main array,
    //but preserve its path number (anger=0/joy=1/fear=2) and chunk number
    var helperArr=generateHelperArr(emoScores);
    //Pad both arrays
    padArray(emoScores,paddingSize);
    padArray(helperArr,paddingSize,[-1,-1]);
    //get terrainWidth and terrainHeight
    var terrainWidth=emoScores.length*250;
    var terrainHeight=emoScores[0].length*200;
    //get wS and hS
    var wS=(emoScores[0].length*scaleUp)-1;
    var hS=(emoScores.length*scaleUp)-1;
    //Establish padding and bounds
    var paddingX=(paddingSize/(emoScores[0].length+paddingSize))*terrainWidth;
    var paddingZ=(paddingSize/(emoScores.length+paddingSize))*terrainHeight;
    var xBound=terrainWidth/2-(paddingX/2);
    var zBound=terrainHeight/2-(paddingZ/2);
    //Magnify both arrays
    var scaledArr=magnifyArray(emoScores,scaleUp);
    var helperArr=magnifyArray(helperArr,scaleUp);
    //Smooth both arrays to prevent blocky terrain
    var smoothedArr=smoothArray(scaledArr,smoothingRadius);
    //Flatten both arrays
    var flattenedArr=flattenArray(smoothedArr);
    var helperArrFlat=flattenArray(helperArr);

    var numChunks=scaledArr[0].length;
    return {flattenedArr: flattenedArr, numChunks:numChunks, helperArrFlat:helperArrFlat,wS:wS,hS:hS,terrainWidth:terrainWidth, terrainHeight:terrainHeight, paddingX:paddingX, paddingZ:paddingZ,xBound:xBound,zBound:zBound};

}

/*Places a very large plane under the generated geometry to prevent the appearance of a finite square world*/
function makeBase(terrainWidth,terrainHeight,material){
    var geometry = new THREE.PlaneGeometry(terrainWidth*2,terrainHeight*2,1,1);
    //should make the same as in generateGemoetry()
    // var material = new THREE.MeshLambertMaterial({ color: 'red', shading: THREE.FlatShading }); 
    var plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y=-1;
}

/*Generates and returns the terrain mesh. Calls buildZonesDict, allowing us easy later access the different parts of the terrain*/
function generateMesh(terrainWidth,terrainHeight,wS,hS,numChunks,flattenedArr,helperArrFlat){
    //Generate geometry and material
    var geometry = new THREE.PlaneGeometry(terrainWidth,terrainHeight,wS,hS);
    var material = new THREE.MeshLambertMaterial({ color: 0xBA8BA9, shading: THREE.FlatShading});
    vertexDict={};
    distanceX=Math.abs(Math.round(geometry.vertices[1].x-geometry.vertices[0].x));
    distanceY=Math.abs(Math.round(geometry.vertices[numChunks].y-geometry.vertices[0].y));
    zZones={};
    xZones={};
    var updatedDict
    for(var i=0; i<geometry.vertices.length; i++){
        geometry.vertices[i].z =  flattenedArr[i]*200;
    }
    buildZonesDict(zZones,xZones,helperArrFlat,geometry,i);

    //compute normals
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    //Create and rotate mesh
    var plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.castShadow=true;
    plane.receiveShadow=true;
    makeBase(terrainWidth,terrainHeight,material);
    return plane
}

function buildZonesDict(zZones,xZones,helperArrFlat,geometry){
        var vertexDictY;
        var vertexDictX;
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


