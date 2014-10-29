
Template.list.events({
    'click button.probe-btn': function(e) {
        var marker = markers[e.target.name];
        marker.togglePopup ? marker.togglePopup() : marker.openPopup();
    }
});