Router.route('/', function() {
    this.render('map');
});

Router.route('/adm', function() {
    this.layout('adminLayout');
    this.render('admin');
});
Router.route('/adm/list', function() {
    this.layout('adminLayout');
    this.render('toggleBlocksPage');
});
