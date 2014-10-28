var actions = {
    "Ślad": function() {
        showTrack(this._id);
    },
    "Zmień kolor": function() {
        Probes.update(this._id, {
            $set: {
                color: randomColor()
            }
        });
    },
    "Usuń": function() {
        if (window.confirm("Usunąć z " + this.name + "?")) {
            Probes.remove(this._id);
        }
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
        var name = window.prompt("Nazwa",this.name|| '');
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
Template.popup.helpers({
    actions: function() {
        return _.keys(actions);
    }
});
Template.popup.events({
    'submit form': function(e) {
        e.preventDefault();
        var form = e.target;
        var text = form.sms.value;
        form.sms.value = '';
        form.sms.placeholder = 'Wysyłanie...';
        Meteor.call('sendSms', this._id, text, function(error, result) {
            form.sms.placeholder = error || result.content;
        });
    },
    'change .probe-actions': function(e) {
        var action = actions[e.target.value];
        if (action) {
            action.bind(this)(e);
            e.target.value = '';
        }
    },
});