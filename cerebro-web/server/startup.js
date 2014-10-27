Meteor.startup(function() {
    check(Meteor.settings.smsapi, {
        user: String,
        pass: String
    });
});