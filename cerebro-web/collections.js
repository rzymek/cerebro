Probes = new Mongo.Collection('probes');
Tracks = new Mongo.Collection('tracks');

if (Meteor.isServer) {
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

    Meteor.publish('probes', function() {
        if (!this.userId) {
            this.ready();
            return;
        }
        var user = Meteor.users.findOne(this.userId);
        var email = user && _.chain(user.emails).pluck('address').head().value();
        if (email !== 'rzymek@gmail.com') {
            this.ready();
            return;
        }
        return Probes.find();
    });
}