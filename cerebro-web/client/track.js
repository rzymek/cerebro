track = null;
var showingTrackOf = null;
var handle = null;
showTrack = function(id) {
    if (track !== null) {
        map.removeLayer(track);
    }
    if (handle) {
        handle.stop();
    }
    if (showingTrackOf === id) {
        showingTrackOf = null;
        return;
    }
    handle = Meteor.subscribe("tracks", id, function(arg) {
        console.log(arg, this);
        var latlngs = Tracks.find({}, {
            sort: {timestamp: 1}
        }).map(function(it) {
            return it.location;
        });
        if (latlngs.length === 0)
            return;
        track = L.polyline(latlngs, {
            color: 'red',//Probes.findOne(id).color,
            opacity: 0.5
        }).addTo(map);
        map.fitBounds(track);
    });
    showingTrackOf = id;
};
/*

 echo 'db.probes.remove();db.tracks.remove()'|meteor mongo

 curl -d hello 'http://localhost:3000/rep?name=imei:359585014548124&lat=52.22&lon=21.0'

 cat ../cerebro-web-test/log |while read line;do echo "$line";echo "$line"| telnet localhost 5000;done


 */
