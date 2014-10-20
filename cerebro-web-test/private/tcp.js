// Load the TCP Library
net = require('net');
 
// Start a TCP Server
net.createServer(function (socket) {
  console.log('conn: '+socket.remoteAddress);
  // Handle incoming messages from clients.
  socket.on('data', function (data) {
		console.log('['+data.toString('ascii')+']');
  });
 
  // Remove the client from the list when it leaves
  socket.on('end', function () {
		console.log('end: '+socket.remoteAddress);
  });

}).listen(5000);
 
// Put a friendly message on the terminal of the server.
console.log("Chat server running at port 5000\n");
