const express = require('express');
const fs = require('fs'); // To read the JSON file
const path = require('path'); // To handle file paths
const app = express();

// Define the path to your data file
const dataPath = path.join(__dirname, 'data', 'data.json');

// Basic Express setup
const PORT = 3000;

// Define a GET route to display JSON data in the browser
app.get('/cars', (req, res) => {
  // Read the data from the JSON file
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      // If there's an error, send a 500 server error
      res.status(500).send('Error reading data');
    } else {
      // Parse the JSON data
      const jsonData = JSON.parse(data);

      // Start HTML response with table structure
      let htmlResponse = `
        <html>
          <head>
            <title>Cars Data</title>
            <style>
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>
            <h1>Cars Data</h1>
            <table>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>cars</th>
              </tr>
      `;

      // Loop through the data and create rows for each item
      jsonData.forEach(item => {
        htmlResponse += `
          <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.car}</td>
          </tr>
        `;
      });

      // Close the table and HTML tags
      htmlResponse += `
            </table>
          </body>
        </html>
      `;

      // Send the HTML response with formatted table
      res.send(htmlResponse);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
