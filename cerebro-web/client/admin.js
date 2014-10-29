selectedProbe = function() {
    var id = Session.get('admin_probe');
    return id ? Probes.findOne(id) : null;
};

Template.admin.helpers({
    probe: selectedProbe
});
Template.admin.events({
    'change .probes': function(e, template) {
        Session.set('admin_probe', e.target.value);
    }
})
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
