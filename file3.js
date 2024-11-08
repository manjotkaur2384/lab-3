const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'data', 'data.json');

// Middleware to parse JSON data from requests
app.use(express.json());

// GET method to display JSON as a table
app.get('/data', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading data');
    } else {
      const jsonData = JSON.parse(data);

      // Start HTML response with table structure
      let htmlResponse = `
        <html>
          <head>
            <title>Data</title>
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
            <h1>Data List</h1>
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

// CRUD Operations

// CREATE (POST) - Add new data
app.post('/data', (req, res) => {
    const newData = req.body; // Get the data from the request body
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data');
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(newData); // Add new data to the existing data
            fs.writeFile(dataPath, JSON.stringify(parsedData, null, 2), (err) => {
                if (err) {
                    res.status(500).send('Error writing data');
                } else {
                    res.status(201).json(newData); // Send the newly created data back as response
                }
            });
        }
    });
});

// READ (GET) - Retrieve data (Already covered in file2.js)

// UPDATE (PUT) - Update existing data
app.put('/data/:id', (req, res) => {
    const id = parseInt(req.params.id); // Get the ID from the URL
    const updatedData = req.body; // Get the updated data from the request body
    
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data');
        } else {
            let parsedData = JSON.parse(data);
            let foundIndex = parsedData.findIndex(item => item.id === id); // Find the index of the data with matching ID
            
            if (foundIndex !== -1) {
                // Update the data
                parsedData[foundIndex] = { ...parsedData[foundIndex], ...updatedData };
                fs.writeFile(dataPath, JSON.stringify(parsedData, null, 2), (err) => {
                    if (err) {
                        res.status(500).send('Error writing data');
                    } else {
                        res.status(200).json(parsedData[foundIndex]); // Send back the updated data
                    }
                });
            } else {
                res.status(404).send('Data not found');
            }
        }
    });
});

// DELETE - Delete data by ID
app.delete('/data/:id', (req, res) => {
    const id = parseInt(req.params.id); // Get the ID from the URL
    
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data');
        } else {
            let parsedData = JSON.parse(data);
            let newData = parsedData.filter(item => item.id !== id); // Remove the data with matching ID
            
            if (newData.length === parsedData.length) {
                res.status(404).send('Data not found');
            } else {
                fs.writeFile(dataPath, JSON.stringify(newData, null, 2), (err) => {
                    if (err) {
                        res.status(500).send('Error writing data');
                    } else {
                        res.status(200).send('Data deleted successfully');
                    }
                });
            }
        }
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
