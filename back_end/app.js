const express = require('express');
const app = express();
var rp = require('request-promise');

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/courses', (req, res) => {
	var queryString = "";
	var queryKeys = Object.keys(req.query);
	for (key in queryKeys) {
		if (key == 0) {
			queryString += queryKeys[key] + "=" + req.query[queryKeys[key]];
		} else {
			queryString += "&" + queryKeys[key] + "=" + req.query[queryKeys[key]];
		}	
	}
	var options = {
		uri: 'https://api.auckland.ac.nz/service/courses/v2/courses?' + queryString	
	};
	console.log(options);
	rp(options).then((resp) => {
		console.log("done")
		res.send(resp)
	})
});

app.get('/classes', (req, res) => {
	var queryString = "";
	var queryKeys = Object.keys(req.query);
	for (key in queryKeys) {
		if (key == 0) {
			queryString += queryKeys[key] + "=" + req.query[queryKeys[key]];
		} else {
			queryString += "&" + queryKeys[key] + "=" + req.query[queryKeys[key]];
		}	
	}
	var options = {
		uri: 'https://api.auckland.ac.nz/service/classes/v1/classes?' + queryString	
	};
	console.log(options);
	rp(options).then((resp) => {
		console.log("done")
		res.send(resp)
	})
});




app.listen(3000, () => console.log('Example app listening on port 3000!'))