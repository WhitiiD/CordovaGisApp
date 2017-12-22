// Openlayers benutzt EPSG:3857


// Variable
var vector_point;
var container;
var closer;


// Für WFST
var geoserverHost="192.168.1.140";
var geoserverPort="8080";





function init() {
    document.removeEventListener('DOMContentLoaded', init);    
    vector_point = new ol.source.Vector({}); 
   
    //Elements that make up the popup.
    container = document.getElementById('popup');
    //var content = document.getElementById('pc-viewFeatureInfo');
    closer = document.getElementById('popup-closer');

    // Create an overlay to anchor the popup to the map.
    var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    }));

  
     // Add a click handler to hide the popup.
    closer.onclick = function() {
      overlay.setPosition(undefined);
      closer.blur();
      /* Muss dahin  */
      document.getElementById("dd-delete").removeEventListener("click", deleteButton); 		 
      document.getElementById("dd-save").removeEventListener("click", saveButton);
      
      return false;    
    };
    
    
    // Map Element
    map = new ol.Map({
        target: 'map',
        
        overlays: [overlay],
        
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            new ol.layer.Vector({
                source: vector_point
            })
        ],
        
        controls: [
            //Define the default controls
            new ol.control.Zoom(),
            new ol.control.Rotate(),
            new ol.control.Attribution(),
            //Define some new controls
            //new ol.control.(),
            //new ol.control.MousePosion(),
            new ol.control.ScaleLine(),
            //new ol.control.OverviewMap()
            
        ],        
        view: new ol.View({
            center: [936324.335444, 6276734.067208],
            zoom: 7
        })
        
    });//ende der Map

    map.getViewport().addEventListener("click", function(e) {
        map.forEachFeatureAtPixel(map.getEventPixel(e), function (point_feature, vector_point) {
        	 var a          = point_feature.getProperties();        		
        	 //Erzeugt Koordinate
        	 var coordinate=ol.proj.fromLonLat([a.longitude,a.latitude],'EPSG:3857');
        	 
        	 document.getElementById("pc-viewFeatureInfo-lat").textContent=a.latitude;
        	 document.getElementById("pc-viewFeatureInfo-lon").textContent=a.longitude;
        	 document.getElementById("pc-viewFeatureInfo-time_utc").textContent=point_feature.get('time_utc');
        	 document.getElementById("pc-viewFeatureInfo-acc").textContent=Math.round(point_feature.get('accuracy')*100)/100;
        	 document.getElementById("pc-viewFeatureInfo-nutzungsart").textContent=point_feature.get('nutzungsart');
        	 document.getElementById("pc-viewFeatureInfo-Zeit").textContent=convertTime(point_feature.get('time_utc'));
        	  
        	 /**
        	  * Anmerkung: Eventhandler muss noch verbessert werden!
        	  * */
        	 //Löschen des Features
        	 document.getElementById("dd-delete").addEventListener("click", deleteButton); 	    
        	 function deleteButton(){
        		 //alert("in ddddelte");
        		 var id=point_feature.getId();
        		 deleteFeatureById(id); 		 	 
        		 // Verschwindenlassen des Overlays
        		 overlay.setPosition(undefined);
        		 closer.blur();   		 
        		 //Eventhandler entfernen
        		 document.getElementById("dd-delete").removeEventListener("click", deleteButton); 		 
        		 document.getElementById("dd-save").removeEventListener("click", saveButton);
        	 }
       	  
        	 //Ändern der Nutzungsart
        	 document.getElementById("dd-save").addEventListener("click", saveButton); 
        	 function saveButton(){
        		 var nutzWert = document.getElementById('dd-pc-ViewFeatureInfo').value;
        		 point_feature.set('nutzungsart',nutzWert);
        		 document.getElementById("pc-viewFeatureInfo-nutzungsart").textContent=point_feature.get('nutzungsart');	 
        		 //Eventhandler entfernen
        		 document.getElementById("dd-delete").removeEventListener("click", deleteButton); 		 
        		 document.getElementById("dd-save").removeEventListener("click", saveButton);
        	 }   	 
		   	 overlay.setPosition(coordinate);
        });
    });
    
    
}//End of Init



// Fertigt die PointFeature List der Einstellungen an
function pointFeatureListSettings(){	

	opt_this=null;
	var node=document.getElementById("point-feature-list");

	while (node.hasChildNodes()) {
	    node.removeChild(node.lastChild);
	}
	vector_point.forEachFeature(function(e){	
		if(e!=null){
			var newListElement = document.createElement("li");		
			newListElement.innerHTML = "Id:  " + e.getId() + "  Lat: " + e.get("latitude") + "  Lon: " + e.get("longitude") + "  acc: " + e.get("accuracy") + "  Nutzungsart: " + e.get("nutzungsart");
			document.getElementById("point-feature-list").appendChild(newListElement);
		}
		else {
			return true;
		}	
	}, opt_this);
}



function focus(){
	getCurrentPos(12);
}

function goToPos(coo,zl) {
	map.getView().setCenter(ol.proj.fromLonLat(coo),'EPSG:3857');
}

//Fügt ein Punk zum Layer vector_layer hinzu

function addPointToLayer(point){	
	// Entnimmt die Länge und Breite aus dem Punkt
	var coo=[point.longitude,point.latitude];	
	// Erzeugt Koordinate aus dem Array coo und transformiert diese
	var coord=ol.proj.fromLonLat(coo,'EPSG:3857');
	// Macht aus der Koordinate eine geometrie
	var geo=new ol.geom.Point(coord);
	// Ein neues point-feature wird erzeugt.
	var point_feature = new ol.Feature({});	
	// Setzen des Geometrietypes
	point_feature.setGeometry(geo);	
	// Setzen einer ObjectID: Timestemp ist einmalig! --> ID
	point_feature.setId(point.time_utc);
	// Objekt point aus Argument wird zu den Eigenschaften des Features
	point_feature.setProperties(point);
	// Fügt dem Vector_layer der Karte das Punktfeature hinzu
	vector_point.addFeature(point_feature);
}

// Löscht ein Feature aus dem Layer vector_point
function deleteFeatureById(featureId){
	var a=vector_point;
	var id=featureId;
	a.removeFeature(a.getFeatureById(id));
}


//Send Feature to wfst
function sendWFST(){
	alert("in send WFS-T");
	
	//var featureType = new ol.geom.Point();
	var featuresToInsert;
	var featuresToUpdate=null;
	var featuresToDelete=null;
	var transactionRequest=null; 
	var xmlGeschickt=null;
	var url='http://' + geoserverHost + ':' + geoserverPort + '/geoserver/wfs';
	
	
	//wfs_geom
	var xs=new XMLSerializer();
	var formatWFS = new ol.format.WFS();
	var formatGML = new ol.format.GML({
	    featureNS: 'http://192.168.1.140/geoserver/wfs',
	    featureType: 'wfs_geom',
	    srsName: 'EPSG:3857'
	    	
	});
	
	
	
	vector_point.forEachFeature(function(e){	
		if(e!=null){	

			featuresToInsert=e;
			
			transactionRequest = (formatWFS.writeTransaction(featuresToInsert, null, null, formatGML));
		
			xmlGeschickt = xs.serializeToString(transactionRequest);		
		
			$.ajax(url,{
			    type: 'POST',
			    dataType: 'xml',  
			    contentType: 'text/xml',
			    data: xmlGeschickt
			}).done(function() {
			   // alert("Übertragen");
			});
	
		}
		else {
			return true;
		}	
	}, null);
	
}


document.addEventListener('DOMContentLoaded', init);	