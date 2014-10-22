Template.list.helpers({
    probes: function() {
        return Probes.find();
    }
});
Template.list.events({
    'click button.probe-btn': function(e) {
        var marker = markers[e.target.name];
        marker.togglePopup ? marker.togglePopup() : marker.openPopup();
    }
});


Template.popup.events({
    'click button.trace-btn': function() {
        e.preventDefault();
        showTrack(this._id);
    },
    'submit form': function(e) {
        e.preventDefault();
        var form = e.target;
        Meteor.call('sendSms', this._id, form.sms.value, function(error, result) {
            form.sms.placeholder = error || result.content;
        });
        form.sms.value = '';
    }
});