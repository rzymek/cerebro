var send = function(method, probeId, e) {
    e.preventDefault();
    var form = e.target;
    var text = form.input.value;
    form.input.value = '';
    form.input.placeholder = 'Wysyłanie...';
    Meteor.call(method, probeId, text, function(error, result) {
        form.input.placeholder = error || result.content;
    });
};

Template.probeSMS.events({
    'submit .sms-form': function(e) {
        send('sendSMS', this._id, e);
    }
});

active = function(act) {
    Session.get('minutes'); //refresh every minute
    if (act && act.when) {
        var until = moment(act.when).add(act.timespan, 'minutes');
        return until.isAfter(/*now*/);
    } else {
        return false;
    }
};

Template.activation.helpers({
    message: function() {
        Session.get('minutes'); //refresh every minute
        var act = this;
        if (act && act.when) {
            var until = moment(act.when).add(act.timespan, 'minutes');
            var msg = 'Co ' + act.interval + 'min do ' + until.format('HH:mm (DD.MM.YYYY)') + '. ';
            var left = until.diff(moment(), 'minutes');
            if (left >= 0) {
                msg += 'Zostało ' + left + 'min.';
            } else {
                msg += 'Nieaktywny.';
            }
            return msg;
        } else {
            return 'Nie aktywowany tutaj.';
        }
    },
    class: function() {
        return active(this) ? 'active' : 'inactive';
    }
});