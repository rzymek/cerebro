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