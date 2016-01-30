var express = require('express');
var mongoose = require('../lib/mongo');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var uploadName;

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './storage');
  },
  filename: function (req, file, callback) {
  	uploadName = file.originalname;
    callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage});

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.post('/change', upload.single('image'), function(req, res, next) {
	var elementID = req.body.formid;
	console.log('elementID: ' + elementID);
	console.log('test:' + uploadName);
	mongoose.changePic(elementID, uploadName);
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
