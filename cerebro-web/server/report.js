function isNumber(x) {
    return !isNaN(Number(x));
}
registerReport = function(data) {
    check(data, {
        lat: Match.Where(isNumber),
        lon: Match.Where(isNumber),
        name: String
    });
    var probe = {
        location: {
            lat: data.lat,
            lon: data.lon
        },
        name: data.name,
        timestamp: new Date()
    };
    Probes.upsert({name: data.name}, {
        $set: probe,
        $setOnInsert: {
            color: randomColor(),
            created: new Date()
        }
    });
    Tracks.insert(probe);
};

WebApp.connectHandlers.use("/rep", function(req, res) {
    registerReport(req.query);
    res.writeHead(200);
    res.end('OK');
});