const viewCounter = require("../modules/userCounter");

let msg;
let cachedData = null; // New variable to store cached data

function init(server, WebSocket) {
  server.on("connection", (ws, request) => {
    const protocols = request.headers["sec-websocket-protocol"];
    if (protocols === "dashboard") {
      if (cachedData) {
        // If there's cached data, send it to the new dashboard
        ws.send(JSON.stringify(cachedData.newDataToSend));
        cachedData = null; // Clear the cached data
      }
    } else {
      viewCounter.incrementCounter();
    }
    ws.on("message", (message) => {
      // Check if dashboard connected

      msg = JSON.parse(message);
      // Making message to JSON
      const currentCount = viewCounter.getCounter();

      const newDataToSend = {
        currentCount: currentCount,
        type: "join",
        msg,
      };

      // Sending Data to dashboard
      server.clients.forEach((client) => {
        if (
          client.readyState === WebSocket.OPEN &&
          client.protocol === "dashboard"
        ) {
          // Convert the JSON object back to a string before sending
          client.send(JSON.stringify(newDataToSend));
          cachedData = {
            ws,
            newDataToSend,
          }; // Cache the data for the initial dashboard
        }
      });
    });
    // Handling closing

    ws.on("close", () => {
      if (protocols === "dashboard") {
        cachedData = null;
      } else {
        viewCounter.decrementCounter();
        const currentCount = viewCounter.getCounter();
        const leavingDataMsg = {
          currentCount,
          type: "leave",
          msg: msg, // Include the "leave" message data
        };

        server.clients.forEach((client) => {
          if (
            client.readyState === WebSocket.OPEN &&
            client.protocol === "dashboard"
          ) {
            // Convert the JSON object back to a string before sending
            client.send(JSON.stringify(leavingDataMsg));
          }
        });
      }
    });
  });
}

module.exports = {
  init,
};
