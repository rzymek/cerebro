Probes = new Mongo.Collection('probes');
Tracks = new Mongo.Collection('tracks');

timestampQuery = function(query, user) {
    if (user === undefined) {
        user = Meteor.user();
    }
    if (user && user.settings && user.settings.startDate) {
        query.timestamp = {$gt: new Date(user.settings.startDate)};
    }
    return query;
};

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
            return false;
        },
        update: function(userId) {
            return isAdmin(userId);
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
            var user = Meteor.users.findOne(this.userId);
            return Tracks.find(timestampQuery({
                deviceId: id
            }, user));
        }
    });
}