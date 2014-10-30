registerReport = function(data, name) {
    check(data, {
        location: {
            lat: Match.Where(Number),
            lon: Match.Where(Number)
        },
        deviceId: String,
        type: String,
        number: Match.Optional(String),
        speed: Match.Optional(Number),
        accuracy: Match.Optional(Number),
        requestedBy: Match.Optional(String),
        battery: Match.Optional(String),
        signal: Match.Optional(String),
        bridgeId: Match.Optional(String),
        timestamp_gps: Match.Optional(String)
    });
    if (data.timestamp_gps)
        data.timestamp_gps = new Date(data.timestamp_gps);
    data.timestamp_received = new Date();
    Probes.upsert(data.deviceId, {
        $set: data,
        $setOnInsert: {
            color: randomColor(),
            blocked: true,
            timestamp_created: new Date(),
            name: name || data.deviceId
        }
    });
    Tracks.insert({
        deviceId: data.deviceId,
        location: data.location,
        speed: data.speed,
        accuracy: data.accuracy,
        battery: data.battery,
        timestamp: data.timestamp_gps
    });
};

WebApp.connectHandlers
        .use(connect.urlencoded())
        .use(connect.json())
        .use("/report", Meteor.bindEnvironment(function(req, res) {
            console.log(req.body);
            registerReport(req.body, req.query.name);
            console.log("done");
            res.writeHead(200);
            res.end('OK');
        }));
