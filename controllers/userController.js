const jwt = require('jsonwebtoken');
const model = require('../models/userModel.js');
const config = require('../config/config.js').config;

register = (req, res) => {
	let user = req.body;
	if(!user.userName) res.status(400).json({message: "UserId Missing."});
	if(!user.password) res.status(400).json({message: "Password Missing."});
	else {
		model.findOne({userName: user.userName}) 				// to check if user with same name already exist
		.then((userDoc) => {
			if(!userDoc) {
				user = new model(user);
				user.save()
				.then((user) => {
					res.status(200).json(user);
				})
				.catch((err) => {
					console.log("Error While Creating User: ", err);
					res.status(400).send(err);
				});
			} else res.status(400).json({message: "User with userName " + user.userName + " Already Exist."})
		})
		.catch((err) => {
			console.log("Error While Fetching User: ", err);
			res.status(400).send(err);
		});
	}
}

login = (req, res) => {
	let user = req.body;
	if(!user.userName) res.status(400).json({message: "UserId Missing."});
	if(!user.password) res.status(400).json({message: "Password Missing."});
	else {
		model.findOne({userName: user.userName})
		.then((userDoc) => {
			if(!userDoc) res.status(400).json({message: "User Not Found."});
			else if(userDoc.password !== user.password) res.status(400).json({message: "Wrong Password."});
			else {
				let token = jwt.sign(userDoc.toObject(), config.apiSecretKey);
				res.status(200).json({message: "Login Successfully.", token: token});
			}
		})
		.catch((err) => {
			console.log("Error While Login User: ", err);
			res.status(400).send(err);
		});
	}
}

module.exports = {
	register: register,
	login: login
}