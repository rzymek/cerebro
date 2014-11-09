function createIcon(probe) {
    var name = probe.name || '';
    var color = (probe.color || 'blue')
    return  L.icon({
        iconUrl: '/icon.svg?color=' + encodeURIComponent(color) + "&border=black&text=" + encodeURIComponent(name.substr(0, 2).trim()),
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });
}

markers = {};

Template.map.rendered = function() {
    map = new L.Map('map', {
        center: [52.22, 21.0],
        zoom: 8
    });
    L.Icon.Default.imagePath = 'packages/boustanihani_meteor-leaflet/images';

    var url = 'http://{s}.tiles.mapbox.com/v3/rzymek.k0pajp3i/{z}/{x}/{y}.png';
    if (Meteor.user() && Meteor.user().settings && Meteor.user().settings.mapUrl) {
        url = Meteor.user().settings.mapUrl;
    }
//    var url='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    L.tileLayer(url, {
        maxZoom: 18,
        attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);
    map.on('locationfound', function(e) {
        map.setView(e.latlng, 12);
    });
    map.locate({setView: true, maxZoom: 16});

    function createPopup(probeId) {
        var div = document.createElement("div");
        Blaze.renderWithData(Template.popup, function() {
            return Probes.findOne(probeId);
        }, div);
        return div;
    }
    getProbes().observe({
        added: function(probe) {
            if (probe.location === undefined)
                return;
            var id=probe._id;
            var marker = L.marker(probe.location, {
                icon: createIcon(probe)
            });
//            marker.setRadius(7/*m*/);
            marker.addTo(map);
            marker.bindPopup(createPopup(id));
            markers[id] = marker;
            Session.set('markers_timestamp', moment().unix());
        },
        changed: function(probe) {
            var id=probe._id;
            var marker = markers[id];
            if (marker === undefined)
                return;
            marker.setLatLng(probe.location);
            marker.setIcon(createIcon(probe));
        },
        removed: function(probe) {
            var id=probe._id;
            var marker = markers[id];
            if (marker === undefined)
                return;
            map.removeLayer(marker);
            if (track)
                map.removeLayer(track);
            delete markers[id];
            Session.set('markers_timestamp', moment().unix());
        }
    });
};

Meteor.setInterval(function() {
    Session.set('minutes', moment().minutes());
}, 60 * 1000);

/*
 Tracker.autorun(function() {
 console.log('refresh markers:', markers);
 Session.get('minutes');
 Session.get('markers_timestamp');
 _.pairs(markers).map(function(it) {
 return {
 id: it[0],
 marker: it[1]
 };
 }).forEach(function(entry) {
 var icon = createIcon(Probes.findOne(entry.id, {
 fields: {
 color: 1,
 activation: 1,
 name: 1
 }
 }));
 entry.marker.setIcon(icon);
 });
 });
 */