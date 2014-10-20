Probes = new Mongo.Collection('probes');
Tracks = new Mongo.Collection('tracks');

Probes.allow({
    insert: function(userId, probe) {
        probe.color = randomColor();
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});