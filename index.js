const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');

//urlencoded is a middleware that parses the body of the request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//cors is a middleware that allows cross origin requests
app.use(cors());

app.post('/api/students', (req, res) => {
    const { firstName, lastName, classification, email } = req.body;
    console.log(firstName, lastName, classification, email);
    res.json({ message: 'User created' });
});

app.get('/api/students', (req, res) => {
    res.send('Hello World');
});

http.createServer(app).listen(8080, () => {console.log('Server is running on port 8080')});