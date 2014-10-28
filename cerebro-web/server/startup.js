Meteor.startup(function() {
    check(Meteor.settings.smsapi, {
        user: String,
        pass: String,
    });
    check(Meteor.settings.parse, {
        appId: String,
        restKey: String
    });
});

Accounts.validateNewUser(function(user) {
    if (user.username === 'rzymek@gmail.com')
        return true;
    throw new Meteor.Error(403, "Disabled");
});