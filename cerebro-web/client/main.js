Meteor.startup(function() {
    Meteor.subscribe("probes");
    Meteor.subscribe("settings");
});

getProbes = function(opt) {
    return Probes.find({
        blocked: {$ne: true}
    }, opt);
};

Template.registerHelper('probes', getProbes);
Template.registerHelper('get', function(key){
    return Session.get(key);
});
