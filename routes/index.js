var express = require('express');
var path = require('path');
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
  	uploadName = req.body.formid + '.png';
    callback(null, uploadName);
  }
});
var upload = multer({ storage : storage});

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.post('/change', upload.single('image'), function(req, res, next) {
	mongoose.changePic(req.body.formid, function(res_status) {
		res.status(res_status.code).send(res_status.msg);
	});
});

router.post('/delete', function(req, res) {
	mongoose.deletePic(req.body.eid);
});

router.get('/add', function(req, res) {
	mongoose.addPic(function(itemID) {
		res.send(itemID);
	});
});

router.get('/init', function(req, res) {
	mongoose.getPicList(function(imgStream) {
		res.send(imgStream);
	});
});

router.get('/storage/:picname', function(req, res) {
	var picDir = req.params.picname;
	res.sendFile(path.resolve('./storage/' + picDir));
});

router.get('/zip', function(req, res) {
	mongoose.zipPic(function(zipFile) {
		res.sendFile(path.resolve(zipFile));
	})
});

router.post('/title', function(req, res) {
	mongoose.updateTitle(req.body.eid, req.body.title);
});

module.exports = router;
