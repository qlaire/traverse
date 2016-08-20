function mainLights(){
    var dirLight = new THREE.DirectionalLight(0xffffff, .6);
    dirLight.position.set(0, 200, 0);
    scene.add(dirLight);

    // var ambLight=new THREE.AmbientLight(0xffffff, .001);
    // scene.add(ambLight);
}

var pointLights;
function pointLights(){
	console.log('zZones and xZones')
	console.log(zZones);
	console.log(xZones);
	pointLights=[];

	//PATH 0 - ANGER
	console.log(Object.keys(zZones));
	var bound1=zZones[2];
	var bound2=zZones[1];
	var xCoord;
	for(var i=0; i<Object.keys(xZones).length; i++){
		xCoord=bound1+(Math.random()*(bound2-bound1));
		pointLights.push(singlePointLight(xZones[i],Math.random()*300,xCoord,'white','brown'));	
	}

	//PATH 1 - JOY
	console.log(Object.keys(zZones));
	var bound1=zZones[1];
	var bound2=zZones[0];
	var xCoord;
	for(var i=0; i<Object.keys(xZones).length; i++){
		xCoord=bound1+(Math.random()*(bound2-bound1));
		pointLights.push(singlePointLight(xZones[i],Math.random()*300,xCoord,'white','yellow'));
	}

	//PATH 2 - FEAR
	console.log(Object.keys(zZones));
	var bound1=zZones[0];
	var bound2=zZones[999];
	var xCoord;
	for(var i=0; i<Object.keys(xZones).length; i++){
		xCoord=bound1+(Math.random()*(bound2-bound1));
		pointLights.push(singlePointLight(xZones[i],Math.random()*350,xCoord,'white', '#9494b8'
));
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
	// console.log(cylinder)
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