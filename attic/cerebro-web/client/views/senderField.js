var mousedown = false;

Template.senderField.helpers({
    name: function(){
        return this.name || this._id;
    }
});

Template.senderField.events({
    'focus .simple-text': function() {
        $(".set-name-btn").css("visibility", "hidden");
        $(document.getElementById("setNameBtn"+this._id)).css("visibility", "visible");
    },
    'mousedown .set-name-btn': function() {
        mousedown = true;
    },
    'mouseup .set-name-btn': function() {
        mousedown = false;
    },
    'blur .simple-text': function() {
        // when clicking on submit buttom, the blur occures before mouseup
        // so the click misses the button 
        if (!mousedown) {
            $(".set-name-btn").css("visibility", "hidden");
        } 
    },
    'submit .set-name': function(e) {
        e.preventDefault();
        $("input").blur();
        Senders.update(this._id, {$set: {name: e.target.name.value}});
    }
});