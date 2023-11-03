const viewCounter = require("../modules/userCounter");
const sqlite3 = require("sqlite3").verbose();

// Create or open the SQLite database
const db = new sqlite3.Database("./data/user.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the database.");
  }
});

// Create the table if it doesn't exist
db.run(
  `
  CREATE TABLE IF NOT EXISTS user_data (
    id INTEGER PRIMARY KEY,
    currentURL TEXT,
    referrerURL TEXT,
    userAgent TEXT,
    utmSource TEXT,
    utmMedium TEXT,
    timestamp TEXT,
    leadSourceName TEXT
  )
`,
  (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
    } else {
      console.log("Table created or already exists.");
    }
  }
);

function init(server, WebSocket) {
  server.on("connection", (ws) => {
    viewCounter.incrementCounter();
    const currentCount = viewCounter.getCounter();

    ws.on("message", (message) => {
      const msg = JSON.parse(message);
      const data = {
        msg,
        currentCount,
      };

      if (msg.type === "clientJoin") {
        const {
          currentURL,
          referrerURL,
          userAgent,
          utmSource,
          utmMedium,
          timestamp,
          leadSourceName,
        } = msg;

        const insertQuery =
          "INSERT INTO user_data (currentURL, referrerURL, userAgent, utmSource, utmMedium, timestamp, leadSourceName) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.run(
          insertQuery,
          [
            currentURL,
            referrerURL,
            userAgent,
            utmSource,
            utmMedium,
            timestamp,
            leadSourceName,
          ],
          (err) => {
            if (err) {
              console.error(
                "Error inserting data into the database:",
                err.message
              );
            } else {
              console.log("Data saved to the database.");
            }
          }
        );
      }

      server.clients.forEach((client) => {
        if (
          client.readyState === WebSocket.OPEN &&
          client.protocol === "dashboard"
        ) {
          client.send(JSON.stringify(data));
        }
      });
    });

    ws.on("close", () => {
      viewCounter.decrementCounter();
      console.log('socket close');
      const newCount = viewCounter.getCounter();
      const newData = {
        type: "count",
        currentCount: newCount,
      };
      server.clients.forEach((client) => {
        if (
          client.readyState === WebSocket.OPEN &&
          client.protocol === "dashboard"
        ) {
          client.send(JSON.stringify(newData));
        }
      });
    });
  });
}

module.exports = {
  init,
};
