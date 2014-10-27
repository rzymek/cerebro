Template.popup.events({
    'click button.trace-btn': function(e) {
        e.preventDefault();
        showTrack(this._id);
    },
    'submit form': function(e) {
        e.preventDefault();
        var form = e.target;
        form.sms.value = '';
        form.sms.placeholder = 'Wysyłanie...';
        Meteor.call('sendSms', this._id, form.sms.value, function(error, result) {
            form.sms.placeholder = error || result.content;
        });
    },
    'click button.color-btn': function() {
        Probes.update(this._id, {
            $set: {
                color: randomColor()
            }
        });
    },
    'click .remove-btn': function() {
        if(window.confirm("Usunąć z "+this.name+"?")) {
            Probes.remove(this._id);
        }
    }
});