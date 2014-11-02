selectedProbe = function() {
    var id = Session.get('admin_probe');
    return id ? Probes.findOne(id) : null;
};

Template.admin.helpers({
    probe: selectedProbe
});
Template.probeSelector.events({
    'change .probes': function(e, template) {
        Session.set('admin_probe', e.target.value);
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


Template.settings.helpers({
    'fetch': function(key) {
        if (!Meteor.user())
            return null;
        var settings = Meteor.user().settings || {};
        return settings[key];
    }
});

Template.settings.rendered = function() {
    this.$('.datetimepicker').datetimepicker({
        minuteStepping: 15,
        language: 'en',
        sideBySide: true
    });
};

Template.settings.events({
    'submit form': function(e, t) {
        e.preventDefault();
        var settings = $(e.target).serializeArray().reduce(function(a, b) {
            a[b.name] = b.value;
            return a;
        }, {});
        Meteor.users.update(Meteor.userId(), {
            $set: {settings: settings}
        });
        var alert = t.$('.alert');
        alert.fadeIn('fast', function() {
            alert.fadeOut('slow');
        });
    }
});
