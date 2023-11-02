const viewCounter = require("../modules/userCounter");

const users = new Map();

function init(server, WebSocket) {
  server.on("connection", (ws) => {
    viewCounter.incrementCounter();
    let data;
    const currentCount = viewCounter.getCounter();

    ws.on("message", (message) => {
      const mgs = JSON.parse(message);
      data = {
        mgs,
        currentCount,
      };

      server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          // Convert the JSON object back to a string before sending
          client.send(JSON.stringify(data));
        }
      });
    });

    ws.on("close", () => {
      viewCounter.decrementCounter();
      const newCount = viewCounter.getCounter();
      server.clients.forEach((client) => {
        client.send(JSON.stringify(newCount));
      });
    });
  });
}

function updateCounter() {}

module.exports = {
  init,
};
