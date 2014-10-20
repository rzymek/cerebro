Template.list.helpers({
    probes: function() {
        return Probes.find();
    }
});
Template.list.events({
    'click button': function(e) {
        var marker = markers[e.target.name];
        marker.openPopup();
    }
});