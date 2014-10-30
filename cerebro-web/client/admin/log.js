Template.log.helpers({
    probe: function() {
        return selectedProbe();
    },
    trace: function() {
        var probeId = Session.get('admin_probe');
        if (!probeId)
            return null;
        Meteor.subscribe("tracks", probeId);
        return Tracks.find({}, {
            sort: {timestamp: 1}
        });
    }
});