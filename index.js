const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wsServer = new WebSocket.Server({ server });

// Servir arquivos estáticos
app.use("/", express.static(path.resolve(__dirname, "../client")));

// Rota para a rota raiz (/)
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./index.html"));
});

wsServer.on("connection", function(ws) {
  ws.on("message", function(msg) {
    wsServer.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg.toString());
      }
    });
  });
});

const PORT = process.env.PORT || 9876;
server.listen(PORT, () => {
  console.log(`Servidor HTTP iniciado na porta ${PORT}`);
});