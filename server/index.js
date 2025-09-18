/*const http = require('http');

const server = http.createServer((req, res) => {
//	  res.writeHead(200, { 'Content-Type': 'text/plain' });
//	  res.end('Hello, Node.js Web Server!');
	
});

const port = 3000;
server.listen(port, () => {
	  console.log(`Server running at http://localhost:${port}/`);
});*/

const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.send("Hello World");
});

app.post('/api/upload', (req, res) => {
	res.send("uploaded succesfully");
	res.send("uploaded successfully");
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log("listening on port" + port);
});
