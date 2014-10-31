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
Template.toggleBlocksPage.helpers({
    probe: function() {
        return selectedProbe();
    }
});

Template.toggleBlocks.events({
    'change .activeProbes': function(e, template) {
        Session.set('admin_probe', e.target.value);
        template.find('.disabledProbes').selectedIndex = -1;
    },
    'dblclick .activeProbes': function(e, template) {
        toggleBlockOne(template.find('.activeProbes'), true);
    },
    'dblclick .disabledProbes': function(e, template) {
        toggleBlockOne(template.find('.disabledProbes'), false);
    },
    'change .disabledProbes': function(e, template) {
        Session.set('admin_probe', e.target.value);
        template.find('.activeProbes').selectedIndex = -1;
    },
    'click .block-one': function(e, template) {
        toggleBlockOne(template.find('.activeProbes'), true);
    },
    'click .block-all': function(e, template) {
        toggleBlockAll(template, '.activeProbes', true);
    },
    'click .unblock-one': function(e, template) {
        toggleBlockOne(template.find('.disabledProbes'), false);
    },
    'click .unblock-all': function(e, template) {
        toggleBlockAll(template, '.disabledProbes', false);
    }
});