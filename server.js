const mongoose = require("mongoose");
const express = require("express");
const app = express();
const body_parser = require("body-parser");

var server_port = 8080;
var server_ip_address = '0.0.0.0';
var connection_string = 'localhost';

app.use(express.static(__dirname+"/public"));
app.use(body_parser.urlencoded({'extended':'true'}));
app.use(body_parser.json());
//app.use(body_parser.json({ type: 'application/vnd.api+json' }))

// Connect to mongo DB
mongoose.connect('mongodb://'+connection_string+':27017/');

var db_schema = mongoose.Schema({
	fname: String,
	lname: String,
	address: String,
	company: String,
	salary: Number
});
var db = mongoose.model("Entry", db_schema);

app.get("/get", function (req, res) {
	db.find( function(err, data) {
		if (err) {
			res.send(err);
		} else {
			res.json(data);
		}
	});
});

app.post("/create", function(req, res) {
	db.create({
		fname: req.body.fname,
		lname: req.body.lname,
		address: req.body.address,
		company: req.body.company,
		salary: req.body.salary
	}, function(err, data) {
		if (err) {
			res.send(err);
		} else {
			db.find( function(err, data) {
				if (err) {
					res.send(err);
				} else {
					res.send(err);
				}
			});
		}
	});
});

app.get("*", function(req, res) {
	res.sendFile(__dirname+"/public/index.html");
});

app.listen(server_port, server_ip_address, function() {
	console.log("Listening on "+server_ip_address+":"+server_port);
})
