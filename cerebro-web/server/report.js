registerReport = function(data) {
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
        timestamp_gps: Match.Optional(Date)
    });
    data.timestamp_received = new Date();

    Probes.upsert(data.deviceId, {
        $set: data,
        $setOnInsert: {
            color: randomColor(),
            name: data.deviceId,
            timestamp_created: new Date()
        }
    });
    Tracks.insert(data);
};

WebApp.connectHandlers
        .use(connect.urlencoded())
        .use(connect.json())
        .use("/report", Meteor.bindEnvironment(function(req, res) {
    console.log(req.body);
    registerReport(req.body);
    res.writeHead(200);
    res.end('OK');
}));
