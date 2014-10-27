Meteor.methods({
    sendSms: function(probeId, text) {
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
                test: 1
            }
        });
    },
    activate: function(probeId) {
        check(probeId, String);
        var probe = Probes.findOne(probeId);
        return HTTP.post('https://api.parse.com/1/push', {
            headers: {
                "X-Parse-Application-Id": Meteor.settings.parse.appId,
                "X-Parse-REST-API-Key": Meteor.settings.parse.restKey
            },
            data: {
                "channels": ["default"],
                "data": {
                    "type": "Activate"
                }
            }
        })
    }
});