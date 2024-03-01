const WebSocket = require('ws');
const express = require('express');
const app = express();
const path = require('path');

app.use("/", express.static(path.resolve(__dirname, "../client")));

const myServer = app.listen(9876);   // regular http server using node express which serves your webpage

const wsServer = new WebSocket.Server({
  noServer: true
});

wsServer.on("connection", function(ws) {
  ws.on("message", function(msg) {
    wsServer.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg.toString());
      }
    })
  })
})

myServer.on('upgrade', async function upgrade(request, socket, head) {
  if(Math.random() > 0.5){
    return socket.end("HTTP/1.1 401 Unauthorized\r\n", "ascii")     //proper connection close in case of rejection
  }

  wsServer.handleUpgrade(request, socket, head, function done(ws) {
    wsServer.emit('connection', ws, request);
  })
})