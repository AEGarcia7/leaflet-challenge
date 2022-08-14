// Connect the link to the webpage 
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Define the function with the information we want and put it on a popup
function popUpMsg(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr>Time of Earthquake: " + new Date(feature.properties.time) + 
        "</h3><hr>Magnitude of Earthquake: " + feature.properties.mag + 
        "</h3><hr>Depth of Earthquake: " + feature.geometry.coordinates[2]);
}

// Request the data from the earthquake URL 
d3.json(earthquakeURL).then(function(data) {

    // Make a GeoJSON layer with the features array on the earthquakeData object
    geojsonLayer = L.geoJSON(data, {
      style: function(feature) {
        return {
          fillColor: getColor(feature.geometry.coordinates[2]),
          weight: 0.7,
          opacity: 1,
          color: 'black',
          fillOpacity: 0.9
        };
      },
      pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {
          radius: feature.properties.mag * 5, 
          fillOpacity: 0.9
        });
    },
      onEachFeature: popUpMsg,
      
    }).addTo(earthquakes);
  
    earthquakes.addTo(myMap);
  });

// Define streetmap and darkmap layers
var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1
 });

var topographicmap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 18
});

// Make a base to hold the two layers
 var baseMaps = {
    "Street Map": streetmap,
    "Topographic Map": topographicmap
};

// Create the map with the streetmap layer as the one to appear on load
  var myMap = L.map("map", {
    center: [ 50, -105 ],
    zoom: 5,
    layers: [streetmap]
});

streetmap.addTo(myMap);

// Make the earthquake overlay 
var earthquakes = new L.LayerGroup();

var overlayMaps = {
    Earthquakes: earthquakes
}

// Make the overlay control to switch between layers and the earthquake option
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// Create the earthquake legend
function getColor(depth) {
    return depth > 90 ? '#ff5f65' :
           depth > 70 ? '#fca35d' :
           depth > 50 ? '#fdb72a' :
           depth > 30 ? '#f7db11' :
           depth > 10 ? '#dcf400' : 
           '#a3f600';
  }
  
  // Add it to map as the legend
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (myMap) {

      var div = L.DomUtil.create('div', 'info legend'),
      depth = [-10, 10, 30, 50, 70, 90];
      labels = [];
  
      for (var i = 0; i < depth.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
              depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
      }
      return div;
  };
  
  legend.addTo(myMap);