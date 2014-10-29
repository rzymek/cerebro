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
        Meteor.call('activate', this._id);
    }
}

getActionKeys = function() {
    return _.keys(actions);
}
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
