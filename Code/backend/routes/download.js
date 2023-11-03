const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const ExcelJS = require('exceljs');

router.get('/', (req, res) => {
  const db = new sqlite3.Database('./data/user.db'); // Replace with the path to your SQLite database file

  db.serialize(() => {
    const sql = 'SELECT * FROM user_data'; // Replace with your SQL query

    db.all(sql, (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error querying the database');
      } else {
        // Create a new Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        // Add headers
        const headers = Object.keys(rows[0]);
        worksheet.addRow(headers);

        // Add data
        rows.forEach((row) => {
          const data = headers.map((header) => row[header]);
          worksheet.addRow(data);
        });

        // Generate the Excel file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader('Content-Disposition', 'attachment; filename=exported-data.xlsx');
        workbook.xlsx.write(res).then(() => res.end());
      }
    });

    db.close();
  });
});

module.exports = router;
