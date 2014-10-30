Probes = new Mongo.Collection('probes');
Tracks = new Mongo.Collection('tracks');

isAdmin = function(userId) {
    if (!userId)
        return false;
    var user = Meteor.users.findOne(userId);
    var email = user && _.chain(user.emails).pluck('address').head().value();
    return email === 'rzymek@gmail.com';
};

if (Meteor.isServer) {
    Probes.allow({
        insert: function(userId, probe) {
            probe.color = randomColor();
            probe.blocked = true;
            probe.timestamp_created = new Date();
            probe.name = probe._id;
            return true;
        },
        update: function() {
            return true;
        },
        remove: function(userId) {
            return isAdmin(userId);
        }
    });

    Meteor.publish('probes', function() {
        if (isAdmin(this.userId)) {
            return Probes.find();
        }
    });
    Meteor.publish('settings', function() {
        if (this.userId) {
            return Meteor.users.find({
                _id: this.userId
            }, {
                fields: {'settings': 1}
            });
        } else {
            this.ready();
        }
    });

    Meteor.publish('tracks', function(id) {
        if (isAdmin(this.userId)) {
            return Tracks.find({deviceId: id});
        }
    });
}