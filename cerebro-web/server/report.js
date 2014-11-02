/*

curl -w'\n' localhost:3000/report -H "Content-Type: application/json" -d '{"location":{"lat":0,"lon":0},"deviceId":"test","type":"cerebro.probe" }'

 */
var blockByDefault = function() {
    var admin = Meteor.users.findOne({"emails.address": 'rzymek@gmail.com'});
    return (admin && admin.settings && admin.settings.blockByDefault) ? true : false;
};

registerReport = function(data, name) {
    console.log(name, data);
    check(data, {
        location: {
            lat: Number,
            lon: Number
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
    if (data.timestamp_gps) {
        data.timestamp_gps = new Date(data.timestamp_gps);
    }
    data.timestamp_received = new Date();
    Probes.upsert(data.deviceId, {
        $set: data,
        $setOnInsert: {
            color: randomColor(),
            blocked: blockByDefault(),
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
        timestamp: data.timestamp_received,
        timestamp_gps: data.timestamp_gps
    });
};

WebApp.connectHandlers
        .use(connect.urlencoded())
        .use(connect.json())
        .use("/report", Meteor.bindEnvironment(function(req, res) {
            try {
                registerReport(req.body, req.query.name);
                res.writeHead(200);
                res.write('OK');
            }catch(e){
                res.writeHead(500);
                res.write('ERROR: '+e.message);
                throw e;
            } finally {
                res.end();
            }
            console.log("done");
        }));
WebApp.connectHandlers
        .use('/get', Meteor.bindEnvironment(function(req, res) {
            try {
                var name = req.query.name;
                req.query.location = {
                    lat: parseFloat(req.query.lat),
                    lon: parseFloat(req.query.lon)
                };
                delete req.query.lat;
                delete req.query.lon;
                delete req.query.name;
                registerReport(req.query, name);
                res.writeHead(200);
                res.write('OK');
            }catch(e){
                res.writeHead(500);
                res.write('ERROR: '+e.message);
                throw e;
            } finally {
                res.end();
            }
        }));

