Geo = new GeoCoder({
    geocoderProvider: 'google',
    language: "PL"
});


Meteor.startup(function() {
    function geocode(report) {
        if (report.location || !report.position)
            return;
        var locations = Geo.reverse(report.position.lat, report.position.lon);
        if (locations && locations.length > 0) {
            Reports.update(report._id, {
                $set: {location: locations[0]}
            });
        }
    }
    Reports.find().observe({
        added: geocode,
        changed: geocode
    });
});