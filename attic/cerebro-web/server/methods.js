var BREAK = {
    SEC: 15 * 60
};
//  curl -w'\n' localhost:3000/report -d '{"sender":"x", "timestamp": 1, "listeners":["X"]}'

function randomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

HTTP.methods({
    'report': function(data) {
        console.log('/report', data);
        check(data, {
            sender: String,
            listeners: [String],
            position: Match.Optional({
                lat: Number,
                lon: Number
            })
        });
        var now = new Date().getTime();
        if (!Senders.findOne(data.sender)) {
            Senders.insert({
                _id: data.sender,
                color: randomColor()
            });
        }

        var upsert = Reports.upsert({
            sender: data.sender,
            start: {$gt: now - BREAK.SEC * 1000}
        }, {
            $set: {
                deviceId: data.sender,
                end: now,
                position: data.position
            },
            $setOnInsert: {
                start: now
            },
            $addToSet: {
                listeners: {$each: data.listeners}
            }
        });

        // workaround for https://github.com/meteor/meteor/pull/2671 {
        if (upsert.insertedId) {
            Reports.update(upsert.insertedId, {
                $pull: {
                    listeners: {"$each": {$exists: true}}
                }
            });
            Reports.update(upsert.insertedId, {
                $addToSet: {
                    listeners: {$each: data.listeners}
                }
            });
        }
        // } workaround for https://github.com/meteor/meteor/pull/2671
        var result = Reports.find({
            sender: data.sender,
            end: {$gt: now - BREAK.SEC * 1000}
        }).fetch();
        return "OK";//JSON.stringify(result, null, 2);
    },
    'reset': function() {
        Reports.remove({});
        Senders.remove({});
        return "reset";
    }
});

