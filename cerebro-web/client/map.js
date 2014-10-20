var list = L.Control.extend({
    options: {
        position: 'topright'
    },
    onAdd: function(map) {
        var list = Blaze.render(Template.list, map.getContainer());
        return list.firstNode();
    }
});

Template.map.rendered = function() {
    var map = new L.Map('map');
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);
    map.on('locationfound', function(e) {
        map.setView(e.latlng, 12);
    });
    map.locate({setView: true, maxZoom: 16});
    map.addControl(new list('bar'));

    var markers = {};
    Probes.find().observeChanges({
        added: function(id, probe) {
            var marker = L.marker(probe.location);
            marker.addTo(map);
            marker.bindPopup(probe.name);
            markers[id] = marker;
            console.log(marker);
        },
        changed: function(id, probe) {
            var marker = markers[id];
            if (probe.location) 
                marker.setLatLng(probe.location);
            if(probe.name)
                marker.setPopupContent(probe.name);
        },
        removed: function(id) {
            var marker = markers[id];
            map.removeLayer(marker);
            delete markers[id];
        }
    });
};