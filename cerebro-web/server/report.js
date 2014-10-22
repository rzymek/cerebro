function isNumber(x) {
    return !isNaN(Number(x));
}
registerReport = function(data) {
    check(data, {
        lat: Match.Where(isNumber),
        lon: Match.Where(isNumber),
        number: Match.Optional(String),
        name: String
    });
    data.location = {
        lat: data.lat,
        lon: data.lon
    };
    delete data.lat;
    delete data.lon;
    data.timestamp = new Date();

    Probes.upsert({name: data.name}, {
        $set: data,
        $setOnInsert: {
            color: randomColor(),
            created: new Date()
        }
    });
    data.name = Probes.findOne({name: data.name})._id;
    Tracks.insert(data);
};

WebApp.connectHandlers.use("/rep", function(req, res) {
    registerReport(req.query);
    res.writeHead(200);
    res.end('OK');
});