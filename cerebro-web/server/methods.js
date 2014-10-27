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
        console.log(probe.number+" <<< "+text);
        return HTTP.post('https://ssl.smsapi.pl/sms.do', {
            params: {
                username: Meteor.settings.smsapi.user,
                password: Meteor.settings.smsapi.pass,
                to: probe.number,
                message: text,
                nounicode: 1,
                max_parts: 1,
                test:1
            }
        });
    }
});