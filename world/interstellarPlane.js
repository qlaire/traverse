var planeHeight=600;
var interstellarPlane;

function placePlane(){
	var geometry = new THREE.PlaneGeometry( terrainWidth,terrainHeight, 32,32);
	var material = new THREE.MeshBasicMaterial( {color: 0x7bbdec, side: THREE.DoubleSide,opacity:0, wireframe:true} );
	material.transparent=true;
	var plane = new THREE.Mesh( geometry, material );
	plane.position.y=planeHeight;
    plane.rotation.x = -Math.PI / 2;
    interstellarPlane=plane;
	scene.add( plane );
}

// function glimmerPlane(){
// 	glimmerPlaneHelper(100);

// }

// function glimmerPlaneHelper(index){
// 	if(index===-1){
// 		return;
// 	}
// 	setTimeout(function(){
// 		interstellarPlane.material.opacity=index;
// 	},50);
// 	if(index<100){
// 		index++;
// 	}
// 	else{
// 		index--;
// 	}
// }

var planeGlimmered=false;
function glimmerPlane(){
	if(!planeGlimmered){
		glimmerPlaneHelper(0,50,false);
		planeGlimmered=true;
	}

}

function glimmerPlaneHelper(index,peak,hitPeak){
    console.log(index);
	if(index===-1){
		return;
	}
	setTimeout(function(){
		interstellarPlane.material.opacity=index/peak;
        if(index===peak){
          hitPeak=true;
        }
        if(hitPeak){
          index--;
        }
        else{
          index++;
        }
        glimmerPlaneHelper(index,peak,hitPeak);
	},.2);

}
