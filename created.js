map.on(L.Draw.Event.CREATED, function (e) {
    
    var coords = [];
    var type = e.layerType,
        layer = e.layer;

    if (type === 'rectangle') {
        coords = layer.getLatLngs()[0].map(function(latlng) {
            return [latlng.lng, latlng.lat];
        });
        coords.push(coords[0]);
    }
    if (type === 'circlemarker') {
        var latlng = layer.getLatLng();
        coords = [
            [latlng.lng - 0.01, latlng.lat - 0.01],
            [latlng.lng + 0.01, latlng.lat - 0.01],
            [latlng.lng + 0.01, latlng.lat + 0.01],
            [latlng.lng - 0.01, latlng.lat + 0.01],
        ];
    }
    console.log("Coords:", coords);

    drawnItems.addLayer(layer);

    var box = turf.polygon([coords]);

    var bbox_coords = turf.bbox(box);

    var center = turf.center(box);
    var lat = center.geometry.coordinates[1];
    var lon = center.geometry.coordinates[0];
    var url = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid="+apiKey;
    $.ajax({
        url: url,
        type: "GET",
        success: function(data) {
            
            var temp = data.main.temp;
            var tempC = Math.round(temp - 273.15);
            var tempF = Math.round((temp - 273.15) * 9/5 + 32);

            if (tempC < 10) {
                console.log("It's cold!");

                div.innerHTML = '<img src="icons/cold.png" width="30" hight="30"> <b>It\'s cold!<b/> <br> <b>Temperature:</b> ' + tempC + '°C / ' + tempF + '°F' + '<b> <br> <br> <b> Proposed places: </b> <br> <img src="icons/museum.png" width="20" height="20"> <b> Museums </b> <br> <img src="icons/gallery.png" width="20" height="20"><b> Galleries </b> <br> <img src="icons/aquarium.png" width="20" height="20"><b> Aquariums </b> <br> <img src="icons/cinema.png" width="20" height="20"><b> Cinemas </b> <br> <img src="icons/planetarium.png" width="20" height="20"><b> Planetariums </b> <br> <img src="icons/art_center.png" width="20" height="20"><b> Art centers </b> <br>';

                var QueryOverpass = `
                    [out:json][timeout:25];
                    (
                        node["amenity"="arts_centre"](${bbox_coords[1]},${bbox_coords[0]},${bbox_coords[3]},${bbox_coords[2]});
                        node["tourism"="museum"](${bbox_coords[1]},${bbox_coords[0]},${bbox_coords[3]},${bbox_coords[2]});
                        node["tourism"="gallery"](${bbox_coords[1]},${bbox_coords[0]},${bbox_coords[3]},${bbox_coords[2]});
                        node["tourism"="aquarium"](${bbox_coords[1]},${bbox_coords[0]},${bbox_coords[3]},${bbox_coords[2]});
                        node["amenity"="cinema"](${bbox_coords[1]},${bbox_coords[0]},${bbox_coords[3]},${bbox_coords[2]});
                        node["amenity"="planetarium"](${bbox_coords[1]},${bbox_coords[0]},${bbox_coords[3]},${bbox_coords[2]});
                    );
                    out body 200;
                    >;
                    out skel qt;
                `;

                $.ajax({
                    url: "https://overpass-api.de/api/interpreter",
                    type: "GET",
                    data: { "data": QueryOverpass },
                    success: function(data) {
                        var geojsonData = osmtogeojson(data);
                        L.geoJson(geojsonData, {
                            pointToLayer: function(feature, latlng) {
                                var infpopup = '';
                                var icon = defaultIcon;
                                if (feature.properties.name) {
                                    if (feature.properties.amenity) {
                                        infpopup = "<b>" + feature.properties.amenity.replace('', ' ') + ':' + feature.properties.name.replace('', ' ') +"</b>";
                                      if (feature.properties.website) {
                                        infpopup += "<br><a href='" + feature.properties.website + "' target='_blank'>Website</a>";
                                    }
                                    switch (feature.properties.amenity) {
                                        case 'arts_centre':
                                            icon = artCenterIcon;
                                            break;
                                        case 'cinema':
                                            icon = cinemaIcon;
                                            break;
                                        case 'planetarium':
                                            icon = planetariumIcon;
                                            break;
                                    }
                                }
                                if (feature.properties.tourism) {
                                    infpopup = "<b>" + feature.properties.tourism.replace('', ' ') + ':' + feature.properties.name.replace('', ' ') +"</b>";
                                    if (feature.properties.website) {
                                        infpopup += "<br><a href='" + feature.properties.website + "' target='_blank'>Website</a>";
                                    }
                                    switch (feature.properties.tourism) {
                                        case 'aquarium':
                                            icon
                                        case 'museum':
                                            icon = museumIcon;
                                            break;
                                        case 'gallery':
                                            icon = galleryIcon;
                                            break;
                                }
                            }
                                var marker = L.marker(latlng, {icon: icon}).bindPopup(infpopup);
                                spotsList.push(marker); 
                                return marker;  
                            }
                        }}).addTo(map);

                    }
                })
                
                } 
                else {
                    console.log("It's hot!");

                    div.innerHTML = '<img src="icons/hot.webp" width="30" hight="30"> <b>It\'s hot!<b/> <br> <b>Temperature:</b> ' + tempC + '°C / ' + tempF + '°F' + '<b> <br> <img src="icons/theme_park.png" width="20" height="20"> <b> Theme Parks </b> <br> <img src="icons/viewpoint.png" width="20" height="20"> <b> Viewpoints </b> <br> <img src="icons/zoo.png" width="20" height="20"> <b> Zoos </b> <br> <img src="icons/attraction.png" width="20" height="20"> <b> Attractions </b> <br> <img src="icons/beach.jpg" width="20" height="20"> <b> Beaches </b> <br> <img src="icons/hot_spring.png" width="20" height="20"> <b> Hot Springs </b> <br>';
                    var QueryOverpass = `
                        [out:json][timeout:25];
                        (
                            node["tourism"="theme_park"](${bbox_coords[1]},${bbox_coords[0]},${bbox_coords[3]},${bbox_coords[2]});
                            node["tourism"="viewpoint"](${bbox_coords[1]},${bbox_coords[0]},${bbox_coords[3]},${bbox_coords[2]});
                            node["tourism"="zoo"](${bbox_coords[1]},${bbox_coords[0]},${bbox_coords[3]},${bbox_coords[2]});
                            node["tourism"="attraction"](${bbox_coords[1]},${bbox_coords[0]},${bbox_coords[3]},${bbox_coords[2]});
                            node["amenity"="fountain"](${bbox_coords[1]},${bbox_coords[0]},${bbox_coords[3]},${bbox_coords[2]});
                            node["natural"="beach"](${bbox_coords[1]},${bbox_coords[0]},${bbox_coords[3]},${bbox_coords[2]});
                            node["natural"="hot_spring"](${bbox_coords[1]},${bbox_coords[0]},${bbox_coords[3]},${bbox_coords[2]});
                        );
                        out body 70;
                        >;
                        out skel qt;
                    `;

                    $.ajax({
                        url: "https://overpass-api.de/api/interpreter",
                        type: "GET",
                        data: { "data": QueryOverpass },
                        success: function(data) {
                            var geojsonData = osmtogeojson(data);
                            L.geoJson(geojsonData,{pointToLayer: function(feature, latlng){
                                var infpopup = '';
                                var icon = defaultIcon;
                                if (feature.properties.name) {
                                    if (feature.properties.amenity) {
                                        infpopup = "<b>" + feature.properties.amenity.replace('', ' ') + ':' + feature.properties.name.replace('', ' ') +"</b>";
                                       if (feature.properties.website) {
                                        infpopup += "<br><a href='" + feature.properties.website + "' target='_blank'>Website</a>";
                                    }
                                    switch (feature.properties.amenity) {
                                        case 'fountain':
                                            icon = fountainIcon;
                                            break;
                                    }
                                }
                                if (feature.properties.tourism) {
                                    infpopup = "<b>" + feature.properties.tourism.replace('', ' ') + ':' + feature.properties.name.replace('', ' ') +"</b>";
                                    if (feature.properties.website) {
                                        infpopup += "<br><a href='" + feature.properties.website + "' target='_blank'>Website</a>";
                                    }
                                    switch (feature.properties.tourism) {
                                        case 'theme_park':
                                            icon = themeParkIcon;
                                            break;
                                        case 'viewpoint':
                                            icon = viewpointIcon;
                                            break;
                                        case 'zoo':
                                            icon = zooIcon;
                                            break;
                                        case 'attraction':
                                            icon = attractionIcon;
                                            break;
                                }
                                if (feature.properties.natural) {
                                    infpopup = "<b>" + feature.properties.natural.replace('', ' ') + ':' + feature.properties.name.replace('', ' ') +"</b>";
                                    if (feature.properties.website) {
                                        infpopup += "<br><a href='" + feature.properties.website + "' target='_blank'>Website</a>";
                                    }
                                    switch (feature.properties.natural) {
                                        case 'beach':
                                            icon = beachIcon;
                                            break;
                                        case 'hot_spring':
                                            icon = hotSpringIcon;
                                            break;
                                    }
                                }
                                var marker = L.marker(latlng, {icon: icon}).bindPopup(infpopup);
                                spotsList.push(marker);
                                return marker;   
                        }}}}).addTo(map);
            
                    }
                });

            }
        }
    });
});
