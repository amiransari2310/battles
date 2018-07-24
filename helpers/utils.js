const fs = require('fs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const csv = require('fast-csv');
const battleModel = require('../models/battleModel.js');
const userModel = require('../models/userModel.js');
const config = require('../config/config.js').config;

// function to load data from csv on service start
loadData = (req, res) => {
	let battleFile = fs.createReadStream(__dirname + "/battles.csv");
	let battles = [];
	battleModel.collection.drop();       // clearing the collection before inserting new records
	csv.fromStream(battleFile, {
        headers: true,
        ignoreEmpty: true
    })
    .on("data", (data) => {
       data['_id'] = new mongoose.Types.ObjectId();
       battles.push(data);
    })
    .on("end", () => {
        battleModel.create(battles)
        .then((documents) => {
          console.log(battles.length + ' battles have been successfully uploaded.');
        })
        .catch((err) => {
          console.log("Error While Uploading Records In Battles: ", err);
        });
    });
}

// function to authenticate token
authenticate = () => {
	return (req, res, next) => {
    if(config.publicURL.indexOf(req.path) === -1) {     // checking for open URL's
      if(!req.headers.authorization) res.status(400).json({message: "Authentication Token Required."});
      else {
        jwt.verify(req.headers.authorization, config.apiSecretKey, async function(err, decoded) {
          if (!err) {
            try {
              let isVerified = await verifyUser(decoded.userName);
              if(isVerified) next();
              else res.status(400).json({message: "Invalid Token."});
            } catch(e) {
              console.log("Error While Verfying User: ", err);
              res.status(400).send(err);  
            }                   
          } else {
            console.log("Error While Verfying Token: ", err);
            res.status(400).send(err);
          }
        }); 
      }
    } else next();
	}
}

// function to verify user from input token
function verifyUser(userName) {
  return new Promise((resolve, reject) => {
    userModel.findOne({userName: userName})
    .then((userDoc) => {
      if(!userDoc) resolve(false);
      else resolve(true);
    })
    .catch((err) => {
      console.log("Error While Fetching User: ", err);
      reject(err);
    });
  });
}


module.exports = {
	loadData: loadData,
	authenticate: authenticate
}