Meteor.startup(function() {
    Meteor.subscribe("probes");
});


sendSms = function(form, probeId) {
    Meteor.call('sendSms', probeId, form.sms.value, function(error,result){
        form.sms.placeholder = error || result.content;
    });
    form.sms.value='';
    return false;
};