if (Meteor.isClient) {
    Template.main.helpers({
        log: function() {
            return Log.find({}, {
                sort: {time: 1},
                limit: 500
            });
        },
        json: function(it) {
            return JSON.stringify(it);
        }
    });
}
if (Meteor.isServer) {
    var server = net.createServer(Meteor.bindEnvironment(function(socket) {
        console.log('conn: ' + socket.remoteAddress);
        socket.on('data', Meteor.bindEnvironment(function(data) {
            console.log('[' + data.toString('ascii') + ']');
            Log.insert({
                from: socket.remoteAddress,
                data: data.toString('ascii'),
                time: new Date()
            });
        }));
    }));
    server.listen(5000);
}

Log = new Meteor.Collection('log');