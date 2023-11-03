const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose(); // Import SQLite3 library

// Initialize the SQLite3 database
const db = new sqlite3.Database('./data/user.db'); // Replace 'your_database.db' with your database file

/* GET home page. */
router.get('/', function(req, res, next) {
  // Fetch up to 200 records from the SQLite3 database
  db.all('SELECT * FROM user_data LIMIT 200', [], (err, rows) => { // Replace 'your_table' with your table name
    if (err) {
      throw err;
    }

    // Render the 'index' view and pass the fetched data as a variable
    res.render('index', { title: 'Express', data: rows });
  });
});

module.exports = router;
