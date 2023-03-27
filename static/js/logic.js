// Create the map object
let geoMap = L.map("map", {
    center: [-2.28, 79.45],
    zoom: 2.75
});

// Add title layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(geoMap);

// Load GeoJSON data. Data selected: M4.5+ Earthquakes in past week.
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

//let geojson;

let earthquakes = [];

d3.json(geoData).then(function(data){
    //Radius scale - increase to make larger
    let radiusScale = 150000
    let color;
    let radius;

    data.features.forEach(function(feature){
        let coordinates = feature.geometry.coordinates;
        let lat = coordinates[1];
        let long = coordinates[0];
        let depth = coordinates[2];
        let magnitude = feature.properties.mag;
        let radius = radiusScale * (magnitude ** 0.4);
    
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

        earthquakes.push({
            location: [lat, long],
            depth: depth,
            magnitude: magnitude,
            color: color,
            radius: radius
        });
    });

    console.log(earthquakes);
    
    for (let i = 0; i < earthquakes.length; i++) {
        L.circle(earthquakes[i].location, {
        color: "black",
        fillColor: earthquakes[i].color,
        fillOpacity: 0.85,
        radius: earthquakes[i].radius
        }).addTo(geoMap);
    }



    //let line = [
    //    [-37.8136, 144.9631],
    //    [-27.4705, 153.0260]
    //  ];
    //  L.polyline(line, {
    //    color: "black"
    //  }).addTo(myMap);
});