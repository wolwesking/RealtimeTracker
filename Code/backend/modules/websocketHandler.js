const viewCounter = require("../modules/userCounter");

function init(server, WebSocket) {
  server.on("connection", (ws) => {
    // Increment the view counter
    viewCounter.incrementCounter();

    const currentCount = viewCounter.getCounter();

    ws.on("message", (message) => {
      const msg = JSON.parse(message);
      const data = {
        msg,
        currentCount,
      };
      // Send data to all connected clients
      server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          // Convert the JSON object back to a string before sending
          client.send(JSON.stringify(data));
        }
      });
    });

    ws.on("close", () => {
      // Decrement the view counter
      viewCounter.decrementCounter();
      const newCount = viewCounter.getCounter();
      const newData = {
        type: 'count',
        currentCount: newCount,
      }
      // Send the updated count to all clients
      server.clients.forEach((client) => {
        if(client.protocol === 'dashboard')
          client.send(JSON.stringify(newData));
      });
    });
  });
}

// You can add your updateCounter function here if needed

module.exports = {
  init,
};
