const fs = require('fs');
const http = require('http');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);

let count = parseInt(fs.readFileSync('log.txt', 'utf-8'), 10);

const io = require('socket.io')(server)
io.on('connection', function(socket) {
  socket.emit('count', count);
  socket.on('count', function() {
    socket.emit('count', count);
  })

  socket.on('increment', function() {
    count++;
    io.emit('count', count);
  })
});

app.get('/', function(req, res) {
  const indexPage = fs.readFileSync('index.html', 'utf-8');
  res.setHeader('Content-Type', 'text/html');
  res.send(indexPage);
}) 

function saveCurrentCount() {
  fs.writeFile('log.txt', count);
};

server.listen(port, function() {
  console.log("Started listening on port ", port);
});

// Save counter every 5 minutes
setInterval(saveCurrentCount, 5 * 60 * 1000);