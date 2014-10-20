Template.map.rendered = function() {
    var map = new L.Map('map');

    // create the tile layer with correct attribution
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on('locationfound', function(e) {
        map.setView(e.latlng, 12);
    });

    map.on('locationerror', function(e) {
        alert(e.message);
    });
    map.locate({setView: true, maxZoom: 16});
};