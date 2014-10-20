function isNumber(x) {
    return !isNaN(Number(x));
}

WebApp.connectHandlers.use("/rep", function(req, res, next) {
    var data = req.query;
    check(data, {
        lat: Match.Where(isNumber),
        lon: Match.Where(isNumber),
        name: String
    });
    res.writeHead(200);
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
    res.end(req.body);
});