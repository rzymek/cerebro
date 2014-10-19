if (Meteor.isClient) {
  Template.hello.helpers({
    log: function () {
      return Log.find({},{sort:{time:1},limit:500});
    }
  });
}
Log = new Meteor.Collection('log');
Router.route('/:path', function() {
	this.render('hello');
});
Router.use(function logHttpRequests () {
  var method = this.method;
  var url = this.url;
  console.log(method + ' ' + url);
		Log.insert({
		method: method,
	 	url: url,
		time: new Date()
  });
  this.next();
}, {where: 'server'});
