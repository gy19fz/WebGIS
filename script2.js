// This is the js file for the choropleth map.

// Initialize function to load the map
function initialize(){

	// Set the basemap.
	var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

	var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr}),
		streets  = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
	
	// Set the body of the map.
	var map1 = L.map('map1', {
		center: [34.983639, 106.550017],
		zoom: 4.4,
		layers: grayscale
	});
	
	//Load the province data of China.
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
		this._div.innerHTML = '<h4>COVID-19 confirmed cases per province in China</h4>' +  (props ?
			'<b>' + props.NAME + '</b><br />' + '<b>'+props.CASES_PER_1M+'</b>' + ' cases per 1M people' + '<br>' + 
			'<b>'+props.CONFIRMED +'</b>'+' confirmed'+ '<br>' +'<b>'+ props.RECOVERED+'</b>'+' recovered'+ '<br>' +'<b>'+ props.DEATHS+'</b>'+' deaths'
			: 'Hover over a province');
	};

	info.addTo(map1);
	
	// get colour depending on the number of COVID-19 confirmed cases
	function getColor(d) {
    return d > 50000 ? '#91003f' :
           d > 1200  ? '#ce1256' :
           d > 900  ? '#e7298a' :
           d > 400  ? '#df65b0' :
           d > 80   ? '#c994c7' :
           d > 30   ? '#d4b9da' :
                      '#f1eef6';
	}
	 
	function style1(feature) {
    return {
        fillColor: getColor(feature.properties.CONFIRMED),
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
			grades = [0, 30, 80, 400, 900, 1200, 50000],
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

