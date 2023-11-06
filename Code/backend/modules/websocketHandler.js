const viewCounter = require("../modules/userCounter");
// IMPORT DATABASE

let msg;
let cacheMgs = [];

function init(server, WebSocket) {
  server.on("connection", (ws, request) => {
    const protocols = request.headers["sec-websocket-protocol"];
    if (protocols === "dashboard") {
      if (cacheMgs.length !== 0) {
        cacheMgs.forEach((dataFromCache) => {
          server.clients.forEach((client) => {
            if (
              client.readyState === WebSocket.OPEN &&
              client.protocol === "dashboard"
            ) {
              // Convert the JSON object back to a string before sending
              client.send(JSON.stringify(dataFromCache.newDataToSend));
            }
          });
        });
      }
    } else {
      viewCounter.incrementCounter();
    }
    ws.on("message", (message) => {
      // Check if dashboard connected

      msg = JSON.parse(message);
      // Making message to json
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
          const newCache = {
            ws,
            newDataToSend,
          };
          cacheMgs.push(newCache);
        }
      });
    });
    // Handling closing

    ws.on("close", () => {
      // Loop through the cacheMgs
      cacheMgs.forEach((data, index) => {
        if (data.ws === ws) {
          viewCounter.decrementCounter();
          const currentCount = viewCounter.getCounter();
          const leavingDataMsg = {
            currentCount,
            type: "leave",
            msg: data.newDataToSend.msg,
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

          // Remove user from the array
          cacheMgs.splice(index, 1);
        }
      });
    });
  });
}
module.exports = {
  init,
};
