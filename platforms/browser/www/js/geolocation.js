function getCurrentPos(zl){
	var options = {
			enableHighAccuracy: true,
			maximumAge: 300
			}	
	var cooDa=[];	
	// Asynchroner Calback!
	var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
	function onError(error) {alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');}		   
	function onSuccess(position) {
			cooDa[0]=position.coords.longitude;
			cooDa[1]=position.coords.latitude;
			goToPos(cooDa,zl);	
	}
}



function addPoint(){

	var options = {
			enableHighAccuracy: true,
			maximumAge: 300
			}   	
	// Asynchroner Calback!
	var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
	function onError(error) {alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');}		   
	function onSuccess(position) {					
			var point= {
					latitude	:position.coords.latitude,
					longitude	:position.coords.longitude,
					altitude	:position.coords.altitude,
					accuracy	:position.coords.accuracy,
					altitudeAccuracy	:position.coords.altitudeAccuracy,
					heading		:position.coords.heading,
					speed		:position.coords.speed,
					time_utc	:position.timestamp,
					nutzungsart :"keine_na"
				}	
			addPointToLayer(point);			
	}
}


/**
 * Empfängt n Punkte und fügt zu einem Array zusammen. Dieses Array besteht aus Objekten mit
 * : 'latitude' 'longitude' 'accuracy' 'time_utc'
 * @param n
 * @returns
 */
function getNPoints(n,middleNPoints){
	alert('In Methode getNPoints');
	if(n==undefined){
		var  n=10;
		alert('in If');
	}	
	var options = {
			enableHighAccuracy: true,
			//maximumAge: 3600000
			maximumAge: 30
			}   	
	var anzErr=0;
	var coords= new Array();	
	for (var counter = 0; counter <= n; counter++){
		var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);	
		alert('in For Schleife');		
		function onError(error) {anzErr++;counter--;}		   
		function onSuccess(position) {			
			var coo= {
					latitude	:position.coords.latitude,
					longitude	:position.coords.longitude,
					accuracy	:position.coords.accuracy,
					time_utc	:position.timestamp
				}
			coords.push(coo);			
		}//End onSuccess
	}//End for				
	middleNPoints(coords);	
}//End middeldPoint


function middleNPoints(pl){
	alert("muss noch implementiert werden");
	/*
	var mLat=0;
	var mLong=0;
	var mAcc=0;
	var id=0;
	var temp;
	
	var c=pl.length;
	for(var i=0; i <=c;c++){
		temp=pl[i];
		mLat=mLat+temp.latitude;
		mLong=mLong+temp.longitude;
		mAcc=mAcc+temp.accuracy;
	}
	
	mLat=mLat/c;
	mLong=mLong/c;
	mAcc=mAcc/c;
	id=pl[0].time_utc;
	
	var point= {
			latitude	:mLat,
			longitude	:mLong,
			altitude	:null,
			accuracy	:mAcc,
			altitudeAccuracy	:null,
			heading		:null,
			speed		:null,
			time_utc	:id
		}
	
	addPointaddPointToLayer(point);
	*/
	
}//end der Funktion middleNPoints


function showPosition() {
	   var options = {
	      maximumAge: 360,
	      enableHighAccuracy: true,
	   }
	   var watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);	   
	   function onSuccess(position) {
		   document.getElementById("kooPos").innerText =("Lat: " + position.coords.latitude + " Long: " + position.coords.longitude + " Acc: " + position.coords.accuracy);	   
	   };   
	   function onError(error) {
	      alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
	   }

}