// Import required modules
const express = require('express');
const bodyParser = require('body-parser');

// Create an instance of the Express application
const app = express();

// Set the port for the server to listen on
const PORT = 80;

// Use middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Define a route to handle incoming POST requests to the root endpoint '/'
app.post('/', (req, res) => {
  // Process incoming POST request containing JSON data
  const jsonData = req.body;
  console.log(jsonData);

  // Create an HTML response containing the formatted JSON data
  const htmlResponse = `<html><body><pre>${JSON.stringify(jsonData, null, 2)}</pre></body></html>`;

  // Send the HTML response back to the client
  res.send(htmlResponse);
});

// Start the server and listen for incoming requests on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
