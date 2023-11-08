const fs = require('fs').promises; // Use promises-based file operations

const logFilePath = './data/log.json';

async function logData(data) {
  // Load the existing log (if any)
  let existingLog = [];
  try {
    const fileData = await fs.readFile(logFilePath, 'utf8');
    existingLog = JSON.parse(fileData);
  } catch (err) {
    // Handle any potential errors, or leave it empty if the log file doesn't exist.
  }

  // Append new data to the log
  existingLog.push(data);

  // Write the updated log back to the file
  await fs.writeFile(logFilePath, JSON.stringify(existingLog, null, 2));
}

module.exports = {
  logData,
};
