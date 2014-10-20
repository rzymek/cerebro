Template.list.helpers({
    probes: function() {
        return Probes.find();
    }
});
Template.list.events({
    'click button': function(e) {
        markers[e.target.name].openPopup();
    }
});