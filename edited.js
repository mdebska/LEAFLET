map.on(L.Draw.Event.EDITED, function (e) {
    var layers = e.layers; // All layers that were edited
    layers.eachLayer(function (layer) {
        // Get the type of the layer
        var type = layer instanceof L.Circle ? 'circlemarker' : 'rectangle';

        // Get the new coordinates of the layer
        var coords;
        if (type === 'rectangle') {
            coords = layer.getLatLngs()[0].map(function(latlng) {
                return [latlng.lng, latlng.lat];
            });
            coords.push(coords[0]);
        }
        if (type === 'circlemarker') {
            var latlng = layer.getLatLng();
            coords = [
                [latlng.lng, latlng.lat],
                [latlng.lng, latlng.lat],
                [latlng.lng, latlng.lat],
                [latlng.lng, latlng.lat],
                [latlng.lng, latlng.lat]
            ];
        }

    spotsList.forEach(function(marker) {
        map.removeLayer(marker);
    });        

    var box = turf.polygon([coords]);

    var bbox_coords = turf.bbox(box);

    var QueryOverpass = `
    [out:json][timeout:25];
    (
      node["amenity"="arts_centre"](${bbox_coords[1]},${bbox_coords[0]},${bbox_coords[3]},${bbox_coords[2]});
    );
    out body 70;
    >;
    out skel qt;
    `;

    // clear the spots list
    spotsList = [];
    
    $.ajax({
        url: "https://overpass-api.de/api/interpreter",
        type: "GET",
        data: { "data": QueryOverpass },
        success: function(data) {
            var geojsonData = osmtogeojson(data);
            L.geoJson(geojsonData,{pointToLayer: function(feature, latlng){
                var infpopup = feature.properties.name 
                ? "<b>" + feature.properties.name.replace('', ' ') + "</b>" 
                : "<b>" + feature.properties.amenity.replace('', ' ')+"</b>";
                var marker = L.marker(latlng).bindPopup(infpopup);
                spotsList.push(marker); // Add marker to the spots list
                return marker;  
            }}).addTo(map);

        }
    });
        
});
});