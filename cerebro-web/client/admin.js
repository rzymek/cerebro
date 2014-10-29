selectedProbe = function() {
    var id = Session.get('admin_probe');
    return id ? Probes.findOne(id) : null;
};

Template.admin.helpers({
    probe: selectedProbe,
    disabled: function() {
        return Probes.find({
            blocked: true
        });
    }
});

Template.probeAdmin.helpers({
    actions: function() {
        return getActionKeys();
    }
});
Template.probeAdmin.events({
    'click button': function(e) {
        var action = actions[e.target.value];
        if (action) {
            action.bind(selectedProbe())(e);
        }
    }
});
