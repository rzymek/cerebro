Template.list.helpers({
    class: function() {
        return active(this.activation) ? 'active-btn' : 'inactive-btn';
    }
});
Template.list.events({
    'click button.probe-btn': function(e) {
        var marker = markers[e.target.name];
        if(!marker)
            return;
        marker.togglePopup ? marker.togglePopup() : marker.openPopup();
    }
});