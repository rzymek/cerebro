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

getFormValues = function(form) {
    return $(form).serializeArray().reduce(function(a, b) {
        a[b.name] = b.value;
        return a;
    }, {});
};

getProbes = function() {
    return Probes.find({
        blocked: {$ne: true}
    }, {
        sort: {
            name: 1
        }
    });
};
Template.registerHelper('date', function(date) {
    return date ? moment(date).format('HH:mm (DD.MM.YYYY)') : date;
});
Template.registerHelper('since', function(date) {
    return date ? moment().diff(moment(date), 'minutes') : date;
});

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
