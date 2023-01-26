require('dotenv').config();
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const util = require('../utils/util');

AWS.config.update({ 
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY 
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function register(user){
    const {firstName, lastName, classification, email, username, password} = user;
    if(!firstName|| !lastName || !classification || !email || !username || !password){
        return util.buildResponse(400, {error: 'All fields are required!'});
    }

    const applicationUser = await getUser(username.toLowerCase().trim());

    if(applicationUser && applicationUser.username){
        return util.buildResponse(400, {error: 'Username already exists!'});
    }

    const encryptedPassword = bcrypt.hashSync(password.trim(), 10);

    const params = {
        TableName: process.env.USER_TABLE,
        Item: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            classification: classification.trim(),
            email: email.trim(),
            username: username.toLowerCase().trim(),
            password: encryptedPassword
        }
    };

    const storeUser = await saveUser(params);

    if(!storeUser){
        return util.buildResponse(503, {error: 'Something went wrong! Please try again later!'});
    }

    return await util.buildResponse(200, {
        username: username.toLowerCase().trim()
    });
}

async function getUser(username){
    const params = {
        TableName: process.env.USER_TABLE,
        Key: {
            username: username
        }
    };

    return await dynamodb.get(params).promise().then(response => {
        return response.Item;
    }, error => {
        console.error('There was an error in getting data about user', error);
    })
}

async function saveUser(params){
    return await dynamodb.put(params).promise().then(response => {
        return true;
    }, error => {
        console.error('There was an error in saving user', error);
    })
}

module.exports = { register };
