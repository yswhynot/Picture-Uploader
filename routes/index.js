var express = require('express');
var mongoose = require('../lib/mongo');
var router = express.Router();
var fs = require('fs');

// var bodyParser = require('body-parser');

// router.use( bodyParser.json() );       // to support JSON-encoded bodies
// router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//   extended: true
// })); 
// router.use(express.json());       // to support JSON-encoded bodies
// router.use(express.urlencoded()); // to support URL-encoded bodies

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.post('/change', function(req, res) {
	var elementID = req.body.elementID;
	// var img = req.files.file;
	console.log(elementID);
	mongoose.changePic(elementID, img);
});

router.post('/delete', function(req, res) {
	var elementID = req.body;
	mongoose.deletePic(elementID);
});

router.get('/add', function(req, res) {
	var newID = mongoose.addPic();
	res.send(newID);
});

router.get('/init', function(req, res) {
	var imgStream = mongoose.getPicList();
	res.send(imgStream);
});

module.exports = router;
