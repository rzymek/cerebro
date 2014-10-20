Template.map.rendered = function() {
    map = new L.Map('map');
    L.Icon.Default.imagePath = 'packages/boustanihani_meteor-leaflet/images';
    var url = 'http://{s}.tiles.mapbox.com/v3/rzymek.k0pajp3i/{z}/{x}/{y}.png'
//    var url='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    L.tileLayer(url, {
        maxZoom: 18,
        center: [52.22, 21.0],
        attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);
    map.on('locationfound', function(e) {
        map.setView(e.latlng, 12);
    });
    map.locate({setView: true, maxZoom: 16});

    function createIcon(color) {
        return {
            fillOpacity: 0.9,
            fillColor: color,
            color: '#000'
        };
    }
    function createPopup(id, probe) {
        return Blaze.toHTMLWithData(Template.popup, _.extend(probe, {_id: id}));
    }
    markers = {};
    Probes.find().observeChanges({
        added: function(id, probe) {
            var marker = L.circleMarker(probe.location, createIcon(probe.color));
            marker.setRadius(10/*m*/);
            marker.addTo(map);
            marker.bindPopup(createPopup(id, probe));
            markers[id] = marker;
        },
        changed: function(id, probe) {
            var marker = markers[id];
            if (probe.location)
                marker.setLatLng(probe.location);
            if (probe.name)
                marker.setPopupContent(createPopup(id, probe));
            if (probe.color)
                marker.setStyle(createIcon(probe.color));
        },
        removed: function(id) {
            var marker = markers[id];
            map.removeLayer(marker);
            if (track)
                map.removeLayer(track);
            delete markers[id];
        }
    });
};