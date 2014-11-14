var app = require('http').createServer(handler);
var redis = require('redis');
var client = redis.createClient();
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8088);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  socket.on('keypress', function(data, fn) {
    client.zrangebylex(['autocomplete', '[' + data, '[' + data + 'z', 'LIMIT',0,20 ],
      function (err, response) {
        if (err) throw err;
        fn(response);
      }
    );
  });
});