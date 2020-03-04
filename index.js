var openurl = require('openurl');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/packages/*', function(req, res){
  res.sendFile(__dirname + req.originalUrl.replace('packages', 'node_modules'));
});

io.on('connection', function(socket){
  socket.on('sql query', function(msg) {
    if (msg.endsWith(';')) {
      msg = msg.slice(0, msg.length-1)
    }
    db.run(msg, function(err, res) {
      if (err) {
        socket.emit('sql error', err.message)
      }
      if (res) {
        socket.emit('sql response', res)
      }
    })
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
  openurl.open('http://localhost:3000');
});
