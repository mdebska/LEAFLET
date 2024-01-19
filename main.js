var map = L.map('map', {maxZoom:20}).setView([51.505, -0.09], 2.5)
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map)
var orto = L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', { attribution: 'google'});
var baseLayers = {
    "Topo Map": osm,
    "Orto Map": orto,
    };
L.control.layers(baseLayers, null, {position:'bottomright'}).addTo(map);

const apiKey = "5d21332002e6bc9ea24ba5f260bc7be0"

L.control.weather({
    apiKey
}).addTo(map);

var geocoder = L.Control.geocoder({
    defaultMarkGeocode: false
})
.on('markgeocode', function(e) {
    var bbox = e.geocode.bbox;
    var poly = L.polygon([
         bbox.getSouthEast(),
         bbox.getNorthEast(),
         bbox.getNorthWest(),
         bbox.getSouthWest()
    ]);
    map.fitBounds(poly.getBounds());
})
.addTo(map);

var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

L.drawLocal.draw.toolbar.buttons.polygon = 'Draw a sexy polygon!';

var drawControl = new L.Control.Draw({
    position: 'topright',
    draw: {
        polyline: false,
        polygon: false,
        circle: false,
        marker: true
    },
    edit: {
        featureGroup: drawnItems,
        remove: true
    }
});
map.addControl(drawControl);


var spotsList = [];

var frame = L.control({position: 'bottomleft'});
var div = L.DomUtil.create('div', 'info legend');

frame.onAdd = function (map) {
    div.style.backgroundColor = 'white'; 
    div.style.border = '1px solid black'; 
    div.style.padding = '10px';
    div.style.borderRadius = '5px'; 
    div.innerHTML = '<b>Hi! Let\'s find sth to do for todays weather.</b> <br> <b> Choose your area!'; 
    return div;
};
frame.addTo(map);

var artCenterIcon = L.icon({
    iconUrl: 'icons/art_center.png',
    iconSize: [20, 20]
})
var cinemaIcon = L.icon({
    iconUrl: 'icons/cinema.png',
    iconSize: [20, 20]
});

var planetariumIcon = L.icon({
    iconUrl: 'icons/planetarium.png',
    iconSize: [20, 20]
});

var aquariumIcon = L.icon({
    iconUrl: 'icons/aquarium.png',
    iconSize: [20, 20]
});

var galleryIcon = L.icon({
    iconUrl: 'icons/gallery.png',
    iconSize: [20, 20]
});

var museumIcon = L.icon({
    iconUrl: 'icons/museum.png',
    iconSize: [20, 20]
});
var defaultIcon = L.icon({
    iconUrl: 'icons/default.png',
    iconSize: [20, 20]
});

var beachIcon = L.icon({
    iconUrl: 'icons/beach.jpg',
    iconSize: [20, 20]
});

var zooIcon = L.icon({
    iconUrl: 'icons/zoo.png',
    iconSize: [20, 20]
});

var attractionIcon = L.icon({
    iconUrl: 'icons/attraction.png',
    iconSize: [20, 20]
});

var fountainIcon = L.icon({
    iconUrl: 'icons/fountain.png',
    iconSize: [20, 20]
});

var hotSpringIcon = L.icon({
    iconUrl: 'icons/hot_spring.png',
    iconSize: [20, 20]
});

var themeParkIcon = L.icon({
    iconUrl: 'icons/theme_park.png',
    iconSize: [20, 20]
});

var viewpointIcon = L.icon({
    iconUrl: 'icons/viewpoint.png',
    iconSize: [20, 20]
});

// lokalizacja użytkownika
var customControl = L.Control.extend({
    options: {
        position: 'bottomright'
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'custom-control-container');

        var button = L.DomUtil.create('button', 'custom-button', container);
        button.innerHTML = 'Locate me';

        button.style.padding = '10px 20px';
        button.style.border = '1px solid #555';
        button.style.backgroundColor = '#f8f9fa';
        button.style.color = '#000';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '14px';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;
                    map.setView([lat, lng], 15);
                });
            } else {
                console.log('Geolocation is not supported by this browser.');
            }
        });

        L.DomEvent.disableClickPropagation(container);

        return container;
    }
});

map.addControl(new customControl());


map.on(L.Draw.Event.DELETED, function (e) {
    spotsList.forEach(function(marker) {
        map.removeLayer(marker);
    });        
    spotsList = [];

});


L.DomUtil.get('changeColor').onclick = function () {
    drawControl.setDrawingOptions({rectangle: {shapeOptions: {color: '#004a80'}}});
};
