Template.probeSMS.events({
    'submit form': function(e) {
        e.preventDefault();
        var form = e.target;
        var text = form.sms.value;
        form.sms.value = '';
        form.sms.placeholder = 'Wysyłanie...';
        Meteor.call('sendSms', this._id, text, function(error, result) {
            form.sms.placeholder = error || result.content;
        });
    }
});