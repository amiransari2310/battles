const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const battleController = require('./controllers/battleController.js')
const userController = require('./controllers/userController.js')
const config = require('./config/config.js').config;
const model = require('./models/battleModel.js');
const util = require('./helpers/utils.js');

mongoose.Promise = global.Promise;

// connecting mongo
mongoose.connect(config.mlabMongoURI, { useNewUrlParser: true }); 

// When successfully connected
mongoose.connection.on('connected', function () {  
  	console.log('Mongoose default connection open to ' + config.mlabMongoURI);
    util.loadData();
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  	console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  	console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  	mongoose.connection.close(function () { 
    	console.log('Mongoose default connection disconnected through app termination'); 
    	process.exit(0); 
  	}); 
}); 

// create express app
const app = express();
app.set('json spaces', 2);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//middleware to authenticate routes with JWT token
app.use(util.authenticate());

// battle routes as mentioned in assignment
app.get('/list', battleController.list);
app.get('/count', battleController.count);
app.get('/stats', battleController.stats);
app.get('/search', battleController.search);

// user routes
app.post('/register', userController.register);
app.post('/login', userController.login);

// listen for requests
app.listen(3000, (err, result) => {
    if(!err) console.log("Server is listening on port 3000");
    else console.log("Error while connecting to port: 3000");
});