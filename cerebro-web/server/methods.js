var sendSMS = function(probeId, text) {
    check(Meteor.userId(), Match.Where(isAdmin));
    check(text, String);
    check(probeId, String);
    check(text, Match.Where(function(x) {
        return x.length < 100;
    }));
    var probe = Probes.findOne(probeId);
    check(probe, Match.ObjectIncluding({number: String}));
    console.log(probe.number + " <<< " + text);
    return HTTP.post('https://ssl.smsapi.pl/sms.do', {
        params: {
            username: Meteor.settings.smsapi.user,
            password: Meteor.settings.smsapi.pass,
            to: probe.number,
            message: text,
            nounicode: 1,
            max_parts: 1,
            test: Meteor.settings.smsapi.test ? 1 : 0
        }
    }).content;
};

Meteor.methods({
    sendSMS: sendSMS,
    activate: function(probeId, interval, timespan) {
        check(Meteor.userId(), Match.Where(isAdmin));
        check(probeId, String);
        check(interval, Match.Integer);
        check(timespan, Match.Integer);
        var probe = Probes.findOne(probeId);
        if (probe.type === 'cerebro.probe') {
            return HTTP.post('https://api.parse.com/1/push', {
                headers: {
                    "X-Parse-Application-Id": Meteor.settings.parse.appId,
                    "X-Parse-REST-API-Key": Meteor.settings.parse.restKey
                },
                data: {
                    channels: ["id"+probe._id],
                    data: {
                        type: "Activate",
                        checkIntervalSec: interval * 60,
                        gpsOnMinutes: timespan
                    }
                }
            }).content;
        } else if (probe.type === 'cerebro.bridge' || probe.type === 'tk106.gprs') {
            if (!probe.number) {
                throw new Meteor.error('no-number', "Brak numeru do wysłania konfiguracji SMS");
            }
            var fill = function(n) {
                if(s > 999)
                    return "999";
                if(s < 0)
                    return "000";
                var s = n.toString().substr(0,3);
                return "000".substr(s.length)+s;
            };
            return sendSMS(probeId, "123456t"+fill(interval)+'m'+fill(Math.round(timespan/interval))+'n');
        }
    }
});