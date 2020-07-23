//This is the hospital capacity choropleth map javascript fileCreatedDate

// Initialize function to load the map
function initialize(){
	
	// Add five hospital marker layers 
	var Hospital_500 = L.layerGroup();
	var Hospital_1000 = L.layerGroup();
	var Hospital_1500 = L.layerGroup();
	var Hospital_2000 = L.layerGroup();
	var Hospital_2500 = L.layerGroup();
	
	// Allocate hospital marker to different layers according to their maximum capacity
	for (a in Hospital_markerData){
		// Set the info window content
		var info = "<div class=infowindow><h2>" +
         Hospital_markerData[a].name + "</h2><h3>Maxmum Capacity: "
         + Hospital_markerData[a].capacity +
         "</h3></div>";
		// Set the marker location 
		var markerLocation = new L.latLng(Hospital_markerData[a].lat, Hospital_markerData[a].lng);
		// Hospital with fewer than 500 beds 
		if (Hospital_markerData[a].capacity < 501) {
			var greenIcon = L.icon({
					iconUrl: 'hospital_level1.png',
					iconSize: [25, 30],
					iconAnchor: markerLocation, // point of the icon which will correspond to marker's location	
				});
				
			var marker = new L.Marker(markerLocation, {icon: greenIcon}).bindPopup(info);
			marker.addTo(Hospital_500);
		//Hospitals with beds between 500 to 1000
		} else if ( Hospital_markerData[a].capacity > 500 && Hospital_markerData[a].capacity < 1001  ) {
			var greenIcon = L.icon({
					iconUrl: 'hospital_level2.png',
					iconSize: [25, 30],
					iconAnchor: markerLocation, // point of the icon which will correspond to marker's location	
				});
			var marker = new L.Marker(markerLocation, {icon: greenIcon}).bindPopup(info);
			marker.addTo(Hospital_1000);
		//Hospital with beds between 1000 to 1500
		} else if ( Hospital_markerData[a].capacity > 1000 && Hospital_markerData[a].capacity < 1501  ) {
			var greenIcon = L.icon({
					iconUrl: 'hospital_level3.png',
					iconSize: [25, 30],
					iconAnchor: markerLocation, // point of the icon which will correspond to marker's location	
				});
			var marker = new L.Marker(markerLocation, {icon: greenIcon}).bindPopup(info);
			marker.addTo(Hospital_1500);
		//Hospital with beds between 1500 to 2000
		} else if ( Hospital_markerData[a].capacity > 1500 && Hospital_markerData[a].capacity < 2001  ) {
			var greenIcon = L.icon({
					iconUrl: 'hospital_level4.png',
					iconSize: [25, 30],
					iconAnchor: markerLocation, // point of the icon which will correspond to marker's location	
				});
			var marker = new L.Marker(markerLocation, {icon: greenIcon}).bindPopup(info);
			marker.addTo(Hospital_2000);
		//Hospital with number more than 2000
		} else {
			var greenIcon = L.icon({
					iconUrl: 'hospital_level5.png',
					iconSize: [25, 30],
					iconAnchor: markerLocation, // point of the icon which will correspond to marker's location	
				});
			var marker = new L.Marker(markerLocation, {icon: greenIcon}).bindPopup(info);
			marker.addTo(Hospital_2500);
		}
			
	}
	// Set the map and basemap layer
	var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

	var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr}),
		streets  = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});

	var map1 = L.map('map1', {
		center: [34.983639, 106.550017],
		zoom: 4.5,
		layers: streets
	});

	var baseLayers = {
		"Grayscale": grayscale,
		"Streets": streets
	};
	
	// Set over layers
	var overlays = {
		"Hospital_500": Hospital_500,
		"Hospital_1000": Hospital_1000,
		"Hospital_1500": Hospital_1500,
		"Hospital_2000": Hospital_2000,
		"Hospital_2500": Hospital_2500
	};
	
	L.control.layers(baseLayers, overlays).addTo(map1);

	var geojson = L.geoJson(statesData).addTo(map1);
	
	// control that shows state info on hover
	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};
	
	// Set the content of info window.
	info.update = function (props) {
		this._div.innerHTML = '<h4>Medical Resources per province in China</h4>' +  (props ?
			'<b>' + props.NAME + '</b><br />' + '<b>'+props.CASES_PER_1M+'</b>' + ' cases per 1M people' + '<br>' + 
			'<b>'+props.Maximum_Capacity +'</b>'+' hospital beds'
			: 'Hover over a province');
	};

	info.addTo(map1);
	
	// get colour depending on population density value
	function getColor(d) {
    return d > 50000 ? '#034e7b' :
           d > 40000  ? '#0570b0' :
           d > 30000  ? '#3690c0' :
           d > 20000  ? '#74a9cf' :
           d > 10000   ? '#a6bddb' :
           d > 5000   ? '#d0d1e6' :
                      '#f1eef6';
	}
	
	function style1(feature) {
    return {
        fillColor: getColor(feature.properties.Maximum_Capacity),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.5
    };
	}
	
	
	L.geoJson(statesData, {style: style1}).addTo(map1);
	
	// highlighted states when they are hover with a mouse.
	function highlightFeature(e) {
		var layer = e.target;
		// set a thick grey border  
		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		});
		// bring layer to the front
		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}

		info.update(layer.feature.properties);
	}

	var geojson;
	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	// A cclick listener that zooms to the state.
	function zoomToFeature(e) {
		map1.fitBounds(e.target.getBounds());
	}

	// Add the listeners on our state layer
	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}

	geojson = L.geoJson(statesData, {
		style: style1,
		onEachFeature: onEachFeature
	}).addTo(map1);

	map1.attributionControl.addAttribution('COVID-19 Data &copy; <a href="https://en.wikipedia.org/wiki/COVID-19_pandemic_in_mainland_China">COVID-19 Pandemic China</a>');

	// Custom Legend Control
	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 5000, 10000, 20000, 30000, 40000, 50000],
			labels = [],
			from, to;

		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

			labels.push(
				'<i style="background:' + getColor(from + 1) + '"></i> ' +
				from + (to ? '&ndash;' + to : '+'));
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};

	legend.addTo(map1);

}
