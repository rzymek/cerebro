var lastColor = null;

var setColor = function(newColor) {
    lastColor = Probes.findOne(this._id).color;
    Probes.update(this._id, {
        $set: {
            color: newColor
        }
    });
};

actions = {
    "Ślad": function() {
        showTrack(this._id);
    },
    "Zmień kolor": function() {
        setColor.bind(this)(randomColor());
    },
    "Poprzedni kolor": function() {
        setColor.bind(this)(lastColor);
    },
    "Blokada": function() {
        Probes.update(this._id, {$set: {blocked: !this.blocked}});
    },
    "Przypisz numer": function() {
        var number = window.prompt("Numer komórkowy:", this.number || '');
        if (number !== null) {
            Probes.update(this._id, {
                $set: {number: number}
            });
        }
    },
    "Nazwij": function() {
        var name = window.prompt("Nazwa", this.name || '');
        if (name !== null) {
            Probes.update(this._id, {
                $set: {name: name}
            });
        }
    },
    "Aktywuj": function() {
        var setup = window.prompt("[Co ile minut],[Przez ile minut]", '3,30');
        if(setup !== null) {
            var regex = /([0-9]+),([0-9]+)/;
            var parsed = regex.exec(setup);
            if(!parsed) {
                window.alert('Niepopranie wpisany setup. Spróbuj "3,30"');
            }
            var interval = parseInt(parsed[1]);
            var timespan = parseInt(parsed[2]);
            Meteor.call('activate', this._id, interval, timespan, function(error, result){
                alert("Aktywacja "+name+": "+JSON.stringify(error || result));
            });
        }
    }
};

getActionKeys = function() {
    return _.keys(actions);
};
Template.probeActions.helpers({
    actions: getActionKeys
});

Template.probeActions.events({
    'change .probe-actions': function(e) {
        var action = actions[e.target.value];
        if (action) {
            action.bind(this)(e);
            e.target.value = '';
        }
    }
});
