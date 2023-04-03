// Create the map object
let geoMap = L.map("map", {
  center: [-2.28, 79.45],
  zoom: 2.75
});

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(geoMap);

// Load GeoJSON data. Data selected: M2.5+ Earthquakes in past week.
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
let geojson;
// set up earthquakes object to store earthquake data
let earthquakes = [];

d3.json(geoData).then(function (data) {
  //Radius scale - increase to make larger
  let radiusScale = 140000;
  let color;

  function getColor(depth) {
    if (depth >= 90) {
      color = "#604E8A";
    } else if (depth >= 70) {
      color = "#875E8E";
    } else if (depth >= 50) {
      color = "#BB708E";
    } else if (depth >= 30) {
      color = "#D0868F";
    } else if (depth >= 10) {
      color = "#DF9C91";
    } else {
      color = "#F8CD9F";
    }
    return color;
  }

  // Save earthquake data and push to object "earthquakes"
  data.features.forEach(function (feature) {
    let coordinates = feature.geometry.coordinates;
    let lat = coordinates[1];
    let long = coordinates[0];
    let depth = coordinates[2];
    let magnitude = feature.properties.mag;
    let radius = radiusScale * (magnitude ** 0.5);

    earthquakes.push({
      location: [lat, long],
      depth: depth,
      magnitude: magnitude,
      color: getColor(depth),
      radius: radius 
    });
  });
  
  // Iterate through earthquakes object to plot points on map
  for (let i = 0; i < earthquakes.length; i++) {
      L.circle(earthquakes[i].location, {
      color: "black",
      fillColor: earthquakes[i].color,
      fillOpacity: 0.85,
      radius: earthquakes[i].radius
      })
      .bindPopup(
        `<h1>Details</h1>
        <hr> <h3>Magnitude: ${earthquakes[i].magnitude.toLocaleString()}</h3>
        <p>
        <h3>Depth(m): ${earthquakes[i].depth.toLocaleString()}</h3>`
      ).addTo(geoMap);
      
  }
});