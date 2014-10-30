Router.route('/', function() {
    this.render('map');    
});

Router.route('/adm', function() {
    this.layout('adminLayout');
    this.render('admin');
});
Router.route('/adm/log', function() {
    this.layout('adminLayout');
    this.render('log');
});
Router.route('/adm/list', function() {
    this.layout('adminLayout');
    this.render('toggleBlocksPage');
});


Router.onBeforeAction(function() {
    if (!Meteor.userId()) {
        this.render('map');
    } else {
        this.next();
    }
}, {
    except: ['map']
});