
var currEntry=null;
var currPath=null;
var months={0:"January",1:"February",2:"March",3:"April",4:"May",5:"June",6:"July",7:"August",8:"September",9:"October",10:"November",11:"December"}
var paths={0:"Anger",1:"Joy",2:"Fear"};

function updateDate(worldCoords){
	locationInfo=getLocation(worldCoords);
	var newEntry=locationInfo.entry;
	var newPath=locationInfo.path;
	if(newPath===-1){
		outsideTime();
		return;	
	}
	if(newEntry!==currEntry){
		if(!worldData.dates[newEntry]){
			outsideTime();
			return;
		}
		var date=worldData.dates[newEntry];
		var d = new Date(date);
	    var curr_date = d.getDate();
	    var curr_month = d.getMonth(); //Months are zero based
	    var curr_year = d.getFullYear();
	    var dateString=(months[curr_month] +" "+curr_date  + ", " + curr_year);
		document.getElementById("key").style.display = 'block';
    	document.getElementById("date").innerHTML = dateString;	
    	document.getElementById("path").innerHTML = '<i>'+paths[newPath]+'</i>';	
    	currPath=newPath;
    	currEntry=newEntry;
	}
}


//REFACTOR - bundle together!!

function outsideTime(){
	blankDate();
	blankPath();
	document.getElementById("key").style.display = 'none';
}
function blankDate(){
	currEntry=null;	
	document.getElementById("date").innerHTML = '';
	return;	
}
function blankPath(){
	currPath=null;	
	document.getElementById("path").innerHTML = '';
	return;	
}