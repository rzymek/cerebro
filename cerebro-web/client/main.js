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
Template.registerHelper('equals', function(a,b){
    return a === b;
});
Template.registerHelper('get', function(key){
    return Session.get(key);
});
