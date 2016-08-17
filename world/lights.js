function mainLights(){
    var dirLight = new THREE.DirectionalLight('#5E6472', .5);
    dirLight.position.set(0, 200, 0);
    scene.add(dirLight);
}

var pointLights;
function pointLights(){
	console.log('xZones and yZones')
	console.log(xZones);
	console.log(yZones);
	pointLights=[];

	//PATH 0 - ANGER
	console.log(Object.keys(xZones));
	var bound1=xZones[2];
	var bound2=xZones[1];
	var xCoord;
	for(var i=0; i<Object.keys(yZones).length; i++){
		xCoord=bound1+(Math.random()*(bound2-bound1));
		pointLights.push(singlePointLight(yZones[i],Math.random()*300,xCoord,'red','brown'));
	}

	//PATH 1 - JOY
	console.log(Object.keys(xZones));
	var bound1=xZones[1];
	var bound2=xZones[0];
	var xCoord;
	for(var i=0; i<Object.keys(yZones).length; i++){
		xCoord=bound1+(Math.random()*(bound2-bound1));
		pointLights.push(singlePointLight(yZones[i],Math.random()*300,xCoord,'orange','yellow'));
	}

	//PATH 2 - FEAR
	console.log(Object.keys(xZones));
	var bound1=xZones[0];
	var bound2=xZones[999];
	var xCoord;
	for(var i=0; i<Object.keys(yZones).length; i++){
		xCoord=bound1+(Math.random()*(bound2-bound1));
		pointLights.push(singlePointLight(yZones[i],Math.random()*350,xCoord,'green','green'));
	}

}


function singlePointLight(x,y,z,lightColor,meshColor){
	var point = new THREE.PointLight(lightColor, .5, 150);
	point.position.set( x,y,z );
	scene.add(point);
	var TILE_SIZE=.5;
	var geometry = new THREE.CylinderGeometry(1, TILE_SIZE, TILE_SIZE, 4 );
	var material = new THREE.MeshBasicMaterial( {color: meshColor} );
	var cylinder = new THREE.Mesh( geometry, material );
	cylinder.position.set(x,y,z);
	scene.add( cylinder );
	console.log(cylinder)
	return cylinder;
	//scene.add(new THREE.PointLightHelper(point, 3));
}

function animatePointLights(){
	for(var i=0; i<pointLights.length; i++){
		pointLights[i].rotation.x+=.01;
		pointLights[i].rotation.y+=.01;
		pointLights[i].rotation.z+=.01;
	}
}