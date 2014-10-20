function fixPos(n) {
    return Number(n) / 100;
}

Meteor.startup(function() {
    var net = Npm.require('net');
    var server = net.createServer(Meteor.bindEnvironment(function(socket) {
        console.log('conn: ' + socket.remoteAddress);
        socket.on('data', Meteor.bindEnvironment(function(data) {
            var line = data.toString('ascii');
            var fields = line.split(/,/);
            var imei = _.chain(fields).filter(function(it) {
                return it.indexOf('imei:') === 0;
            }).first().value();
            console.log(imei);
            registerReport({
                lat: fixPos(fields[5]),
                lon: fixPos(fields[7]),
                name: imei
            });
        }));
    }));
    console.log('TCP server at 5000');
    server.listen(5000);
});