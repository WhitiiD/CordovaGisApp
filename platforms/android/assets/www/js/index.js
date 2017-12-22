var app = {
    
		
	// Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
    },
   
    // deviceready Event Handler 
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
        mapWindowBinds();

        
    },
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        
        console.log('Received Event: ' + id);                                  
      
    }   
};



function mapWindowBinds(){
	// alte EventListener vorsichtshalber entfernen
	/*document.getElementById("settingChangeBtn").removeEventListener("click", settingWindowView);
    document.getElementById("showPosition").removeEventListener("click", showPosition);        
  	document.getElementById("focus").removeEventListener("click", focus);
  	document.getElementById("kooFeature").removeEventListener("click", addPoint);
  	document.getElementById("nPointFeature").removeEventListener("click", getNPoints);
  	document.getElementById("createPointList").removeEventListener("click", pointFeatureListSettings);
  	document.getElementById("sendWFS").removeEventListener("click", sendWFST);
	*/
	document.getElementById("settingChangeBtn").addEventListener("click", settingWindowView);
    document.getElementById("showPosition").addEventListener("click", showPosition);        
  	document.getElementById("focus").addEventListener("click", focus);
  	document.getElementById("kooFeature").addEventListener("click", addPoint);
  	document.getElementById("nPointFeature").addEventListener("click", getNPoints);
  	document.getElementById("createPointList").addEventListener("click", pointFeatureListSettings);
  	document.getElementById("sendWFST").addEventListener("click", sendWFST);
  	
}


function settingWindowView() {	
	document.getElementById("settingstab").style.visibility = "visible";
	document.getElementById("main").style.visibility = "hidden";
	
	document.getElementById("settingChangeBtn").innerHTML ="Karte";
	document.getElementById("settingChangeBtn").removeEventListener("click", settingWindowView);
	document.getElementById("settingChangeBtn").addEventListener("click", mapWindowView);
}

function mapWindowView(){
	document.getElementById("main").style.visibility = "visible";
	document.getElementById("settingstab").style.visibility = "hidden";	
	
	document.getElementById("settingChangeBtn").innerHTML ="Einstellungen";
	document.getElementById("settingChangeBtn").removeEventListener("click", mapWindowView);
	document.getElementById("settingChangeBtn").addEventListener("click", settingWindowView);
}


// Unix Time-Stamp zu echter Zeit
function convertTime(u_time){
	 // Thanks to http://makitweb.com/convert-unix-timestamp-to-date-time-with-javascript/
	 // Unixtimestamp
	 var unixtimestamp = u_time;
	 // Months array
	 var months_arr = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
	 // Convert timestamp to milliseconds
	 var date = new Date(unixtimestamp);
	 // Year
	 var year = date.getFullYear();
	 // Month
	 var month = months_arr[date.getMonth()];
	 // Day
	 var day = date.getDate();
	 // Hours
	 var hours = date.getHours();
	 // Minutes
	 var minutes = "0" + date.getMinutes();
	 // Seconds
	 var seconds = "0" + date.getSeconds();
	 // Display date time in MM-dd-yyyy h:m:s format
	 var convdataTime = day+'-'+month+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
	 
	 return convdataTime; 
	}

app.initialize();