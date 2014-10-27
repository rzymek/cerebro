Template.popup.events({
    'click button.trace-btn': function(e) {
        e.preventDefault();
        showTrack(this._id);
    },
    'submit form': function(e) {
        e.preventDefault();
        var form = e.target;
        var text = form.sms.value;
        form.sms.value = '';
        form.sms.placeholder = 'Wysyłanie...';
        Meteor.call('sendSms', this._id, text, function(error, result) {
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
        if (window.confirm("Usunąć z " + this.name + "?")) {
            Probes.remove(this._id);
        }
    },
    'click .set-number-btn': function() {
        var number = window.prompt("Numer komórkowy:", this.number || '');
        if (number !== null) {
            Probes.update(this._id, {
                $set: {number: number}
            });
        }
    }
});