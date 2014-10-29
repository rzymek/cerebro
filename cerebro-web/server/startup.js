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

Accounts.validateNewUser(function(user) {
    if (user.emails[0].address === 'rzymek@gmail.com')
        return true;
    throw new Meteor.Error(403, "Disabled");
});
Meteor.users.allow({
    update: function(userId, doc, fieldNames){
        return fieldNames.length === 1 && fieldNames[0] == 'settings';        
    }
})