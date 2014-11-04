Template.group.helpers({
    smsProbes: function() {
        return Probes.find({
            blocked: {$ne: true},
            type: {$not: {$regex: /^cerebro.probe/}}
        }, {
            sort: {
                name: 1
            }
        });
    },
    pushProbes: function() {
        return Probes.find({
            blocked: {$ne: true},
            type: {$regex: /^cerebro.probe/}
        }, {
            sort: {
                name: 1
            }
        });
    },
    status: function(id) {
        return {
            probe: Probes.findOne(id),
            result: Session.get('admin_result_' + id)
        };
    }
});
var selectedIds = function(t) {
    return $.makeArray(t.find('select').selectedOptions).map(function(opt) {
        return opt.value;
    });
};

Session.set('admin_group_selected',0);

Template.group.events({
    'change select': function(e, t) {
        Session.set('admin_group_selected', e.target.selectedOptions.length);
    },
    'submit form.groupActivate': function(e, t) {
        e.preventDefault();
        var form = getFormValues(e.target);
        var interval = parseInt(form.interval);
        var timespan = parseInt(form.timespan);
        if (isNaN(interval) || isNaN(timespan)) {
            alert('Nieprawidłowe wartości: ' + JSON.stringify(form));
        } else {
            var selected = selectedIds(t);
            Session.set('admin_selected', selected);
            selected.forEach(function(id) {
                Session.set('admin_result_' + id, '...');
            });
            selected.forEach(function(id) {
                Meteor.call('activate', id, interval, timespan, function(error, result) {
                    Session.set('admin_result_' + id, error || result);
                });
            });
        }
    },
    'submit form.groupConfig': function(e, t) {
        e.preventDefault();
        var form = getFormValues(e.target);
        var server = form.server === "" ? null : form.server;
        var channel = form.channel === "" ? null : form.channel;
        if (server !== null || channel !== null) {
            var selected = selectedIds(t);
            Session.set('admin_selected', selected);
            selected.forEach(function(id) {
                Session.set('admin_result_' + id, '...');
            });
            selected.forEach(function(id) {
                Meteor.call('config', id, server, channel, function(error, result) {
                    Session.set('admin_result_' + id, error || result);
                });
            });
        }
    },
    'click button.groupReset': function(e, t) {
        e.preventDefault();
        var selected = selectedIds(t);
        Session.set('admin_selected', selected);
        var text = "123456begin";
        selected.forEach(function(id) {
            Session.set('admin_result_' + id, '...');
        });
        selected.forEach(function(id) {
            Meteor.call('sendSMS', id, text, function(error, result) {
                Session.set('admin_result_' + id, error || result);
            });
        });
    }
});