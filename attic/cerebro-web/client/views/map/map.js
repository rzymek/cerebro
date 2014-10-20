var markers = {};

var lastReport = function(sender) {
    return Reports.findOne({
        sender: sender,
        position: {$exists: true}
    }, {
        sort: {end: -1}
    });
};

var showAllMarkers = function(map) {
    var bounds = new google.maps.LatLngBounds();
    _.values(markers).forEach(function(marker) {
        bounds.extend(marker.position);
    });
    map.fitBounds(bounds);
};

Template.map_selected.helpers({
    lastReport: function() {
        return lastReport(this._id);
    }
});
Template.map.helpers({
    senders: function() {
        return Senders.find({}, {
            sort: {display: 1, name: 1}
        });
    }
});

Template.map.events({
    'click button': function() {
        Session.set("map_selected", this);
        var marker = markers[this._id];
        if (marker) {
            marker.map.panTo(marker.position);
        }
    }
});


Template.map.rendered = function() {
    GoogleMaps.init({
        'language': 'PL'
    }, function() {
        var mapOptions = {
            zoom: 10,
            center: new google.maps.LatLng(51, 23)
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        markers = {};
        Deps.autorun(function() {
            Senders.find({}, {fields: {}}).forEach(function(sender) {
                var report = lastReport(sender._id);
                if (report) {
                    var marker = markers[report.sender];
                    var latLon = new google.maps.LatLng(report.position.lat, report.position.lon);
                    if (!marker) {
                        markers[report.sender] = marker = new google.maps.Marker({
                            map: map,
                            icon: {
                                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                                scale: 5,
                                strokeColor: sender.color
                            }
                        });
                    }
                    marker.setPosition(latLon);
                }
            });
        });
        showAllMarkers(map);
    });
};