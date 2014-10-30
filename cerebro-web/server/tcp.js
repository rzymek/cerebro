toDegress = function(n) {
    return n.substr(0, 2) * 1 + n.substr(2) / 60;
};

var bufferNullIdx = function(buf) {
    for (var i = 0; i < buf.length; i++) {
        if(buf[i] === 0)
            return i;
    }
    return buf.length;
};

Meteor.startup(function() {
    var net = Npm.require('net');
    var server = net.createServer(Meteor.bindEnvironment(function(socket) {
        console.log('conn: ' + socket.remoteAddress);
        socket.on('data', Meteor.bindEnvironment(function(data) {
            var line = data.toString('ascii', 0, bufferNullIdx(data));
            console.log(line);
            try {
                var fields = line.split(/,/);
                var imei = _.chain(fields).filter(function(it) {
                    return it.indexOf('imei:') === 0;
                }).first().value();
                var report = {
                    location: {
                        lat: toDegress(fields[5]),
                        lon: toDegress(fields[7])
                    },
                    type: "tk106.gprs",
                    speed: fields[9],
                    deviceId: imei
                };
                console.log(report);
                registerReport(report);
            } catch (err) {
                console.error(err, data, line);
            }
        }));
    }));
    console.log('TCP server at 5000');
    server.listen(5000);
});
