var toggleBlockAll = function(template, list, block) {
    template.findAll(list + ' option').forEach(function(it) {
        Probes.update(it.value, {$set: {blocked: block}});
    });
};
var toggleBlockOne = function(list, block) {
    var idx = list.selectedIndex;
    if (idx < 0)
        return;
    Probes.update(list.options[idx].value, {$set: {blocked: block}});
};

Template.toggleBlocks.helpers({
    disabled: function() {
        return Probes.find({
            blocked: true
        });
    }
});

Template.toggleBlocks.events({
    'change .probes': function(e, template) {
        Session.set('admin_probe', e.target.value);
        template.find('.disabledProbes').selectedIndex = -1;
    },
    'change .disabledProbes': function(e, template) {
        Session.set('admin_probe', e.target.value);
        template.find('.probes').selectedIndex = -1;
    },
    'click .block-one': function(e, template) {
        toggleBlockOne(template.find('.probes'), true);
    },
    'click .block-all': function(e, template) {
        toggleBlockAll(template, '.probes', true);
    },
    'click .unblock-one': function(e, template) {
        toggleBlockOne(template.find('.disabledProbes'), false);
    },
    'click .unblock-all': function(e, template) {
        toggleBlockAll(template, '.disabledProbes', false);
    }
});