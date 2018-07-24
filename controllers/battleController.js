const model = require('../models/battleModel.js');

list = (req, res) => {
	model.find({}, {location:1})								// getting only selected fields from mongo
    .then((battleDocs)  => {
    	let locations = battleDocs.map((i) => i.location);
    	res.status(200).json(locations);
    })
    .catch((err) => {
    	console.log("Error While Fetching Locations: ", err);
    	res.status(400).send(err);
    });
}

count = (req, res) => {
    model.countDocuments()
    .then((count)  => {
    	res.status(200).json({count: count});
    })
    .catch((err) => {
    	console.log("Error While Fetching Count: ", err);
    	res.status(400).send(err);
    });
}

stats = (req, res) => {
    model.find({})
    .then((data)  => {
    	if(data.leth !== 0) {
    		let resObj = {
				"most_Active": {
					"attacker_king": getMostActive(data, 'attacker_king'),
					"defender_king": getMostActive(data, 'defender_king'),
					"region": getMostActive(data, 'region'),
					"name": getMostActive(data, 'name')
				},
				"attacker_outcome": {
					"win": getAttackerOutcome(data, 'win'),
					"loss": getAttackerOutcome(data, 'loss')
				},
				"battle_type": getUniqueValues(data, 'battle_type'),
				"defender_Size": {
					"average": getDefenderSize(data, 'average'),
					"min": getDefenderSize(data, 'min'),
					"max": getDefenderSize(data, 'max')
				}
			};
	    	res.status(200).json(resObj);
    	} else res.status(200).json({});
    })
    .catch((err) => {
		console.log("Error While Fetching Data for Stats: ", err);
		res.status(400).send(err);
    });
}

search = (req, res) => {
   model.find(req.query)
    .then((battleDocs)  => {
    	res.status(200).json(battleDocs);
    })
    .catch((err) => {
    	console.log("Error While Fetching Battles: ", err);
    	res.status(400).send(err);
    });
}

// function to get most active entity
function getMostActive(data, key) {
	let mostActive = "";
	let current = 0;
	let tmpArr = data.map(i => i[key]);
	let counts = {};
	tmpArr.forEach((elem, i) => {
    	counts[tmpArr[i]] = 1 + (counts[tmpArr[i]] || 0);
	});
	for(let k in counts) {
		if(current < counts[k]) {
			current = counts[k];
			mostActive = k;
		}
	}
	return mostActive;
}

// function to get attcaker outcome counts
function getAttackerOutcome(data, key) {
	let tmpArr = data.filter(i => i.attacker_outcome === key);
	return tmpArr.length;
}

// function to get unique values for an entity
function getUniqueValues(data, key) {
	let tmpArr = data.map((i) => i[key]);
	return tmpArr.filter((x, i, a) => (a.indexOf(x) === i && x !== ""));
}

// function to get defender size stats
function getDefenderSize(data, key) {
	var tmpArr = data.reduce((f, o) => {
  		if(o.defender_size !== null) f.push(o.defender_size);
		return f;
	}, []);
	let returnValue = 0;
	switch(key) {
    	case 'average':
    		returnValue = tmpArr.reduce((p, c) => p+c, 0)/tmpArr.length;
       		break;
    	case 'min':
        	returnValue = Math.min(...tmpArr);
        	break;
        case 'max':
        	returnValue = Math.max(...tmpArr);
    	default:
    		returnValue = returnValue;
	}
	return returnValue;
}

module.exports = {
	list: list,
	count: count,
	stats: stats,
	search: search
}