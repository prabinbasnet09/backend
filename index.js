require('dotenv').config();
const registerService = require('./services/register');
const http = require('http');
const express = require('express');
const app = express();

const cors = require('cors');

//cors is a middleware that allows cross origin requests
app.use(cors({
    origin: '*'
}
));

//urlencoded is a middleware that parses the body of the request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/students', (req, res) => {
    // const { firstName, lastName, classification, email } = req.body;
    // console.log(firstName, lastName, classification, email);
    const response =  registerService.register(req.body)
    response.then((data) => {
        // // Convert the data.body string into a JavaScript object
        // const jsonData = JSON.parse(data.body);
        // const username = jsonData.username;
        res.json(data.body);
    }, (err) => {
        console.log(err);
    });
});

app.get('/', (req, res) => {
    res.json({
        msg: 'This is the backend for React App'
    });
});

app.get('/api/test', (req, res) => {
    res.send('This is a test');
});

http.createServer(app).listen(process.env.PORT || 8080, 
    () => {console.log('Server is running')});
