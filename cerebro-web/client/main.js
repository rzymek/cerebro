Meteor.startup(function() {
    Tracker.autorun(function() {
        var user = Meteor.user();
        if (user) {
            Meteor.subscribe("probes", user.settings
                    /* Force resubscription by providing a parameter. 
                     * It is accutally unused on the server*/);
        }
    });
    Meteor.subscribe("settings");
});

getProbes = function(opt) {
    return Probes.find({
        blocked: {$ne: true}
    }, opt);
};

Template.registerHelper('probes', getProbes);
Template.registerHelper('equals', function(a, b) {
    return a === b;
});
Template.registerHelper('json', function(o) {
    return JSON.stringify(o);
});
Template.registerHelper('get', function(key) {
    return Session.get(key);
});
