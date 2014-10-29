toDegress = function(n) {
    return n.substr(0, 2) + n.substr(2) / 60;
};

Meteor.startup(function() {
    var net = Npm.require('net');
    var server = net.createServer(Meteor.bindEnvironment(function(socket) {
        console.log('conn: ' + socket.remoteAddress);
        socket.on('data', Meteor.bindEnvironment(function(data) {
            var line = data.toString('ascii');
            console.log(line);
            try {
                var fields = line.split(/,/);
                var imei = _.chain(fields).filter(function(it) {
                    return it.indexOf('imei:') === 0;
                }).first().value();
                registerReport({
                    location: {
                        lat: toDegress(fields[5]),
                        lon: toDegress(fields[7])
                    },
                    type: "tk106.gprs",
                    deviceId: imei
                });
            } catch (err) {
                console.error(err, data, line);
            }
        }));
    }));
    console.log('TCP server at 5000');
    server.listen(5000);
});
