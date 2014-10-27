Meteor.startup(function() {
    check(Meteor.settings.smsapi, {
        user: String,
        pass: String
    });
    check(Meteor.settings.parse, {
        appId: String,
        restKey: String
    });
});