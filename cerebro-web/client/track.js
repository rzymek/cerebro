track = null;
var showingTrackOf = null;
showTrack = function(id) {
    if(track !== null) {
        map.removeLayer(track);
    }
    if(showingTrackOf === id) {
        showingTrackOf = null;
        return;
    }
    var latlngs = Tracks.find({name: id}, {
        sort: {timestamp: 1}
    }).map(function(it) {
        console.log(it);
        return it.location;
    });
    console.log(id,latlngs);
    if(latlngs.length === 0)
        return;
    track = L.polyline(latlngs, {color: 'red'}).addTo(map);
    map.fitBounds(track);
    showingTrackOf = id;
};
/*
 
 echo 'db.probes.remove();db.tracks.remove()'|meteor mongo
 
 curl -d hello 'http://localhost:3000/rep?name=imei:359585014548124&lat=52.22&lon=21.0'
 
 cat ../cerebro-web-test/log |while read line;do echo "$line";echo "$line"| telnet localhost 5000;done
 
 
 */
