
// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
           layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.

    function createCircleMarker(feature,latlng){
        let options = {
            radius: feature.properties.mag*7,
            fillColor: colorChoice(feature.properties.mag),
            color: colorChoice(feature.properties.mag),
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.5
    }
    return L.circleMarker(latlng, options);
}
  
    let  earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createCircleMarker
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);   
 }

 // Color circles based on mag
 function colorChoice(mag) {
    if (mag > 5) {
      return "#EB5406";
    }
    if (mag > 4) {
      return "#F4A460";
    }
    if (mag > 3) {
      return "#FFA600";
    }
    if (mag > 2) {
      return "#F5E216";
    }
    if (mag > 1) {
      return "#F0E68C";
    }
    return "#F3E3C3";
    
  }

let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');

    const grades = [0, 1, 2, 3, 4, 5]
    const colors = [
    "#F3E3C3",
    "#F0E68C",
    "#F5E216",
    "#FFA600",
    "#F4A460",
    "#EB5406"
  ];

    for (var i = 0; i < grades.length; i++) {
        console.log(colors[i]);
        div.innerHTML +=
          "<i style='background: " + colors[i] + "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
  };


function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topo Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });
 


  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

legend.addTo(myMap);

}
