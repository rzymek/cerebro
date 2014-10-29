Meteor.startup(function() {
    Meteor.subscribe("probes");
});

getProbes = function(opt) {
    return Probes.find({
        blocked: {$ne: true}
    }, opt);
};

Template.registerHelper('probes', getProbes);
