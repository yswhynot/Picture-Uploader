var fs = require('fs');
var mongoose = require('mongoose');
var multer = require('multer');
mongoose.connect('mongodb://127.0.0.1/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('MongoDB connected.')
});

var picSchema = mongoose.Schema({date: { type: Date, default: Date.now } });
var picItem = mongoose.model('picItem', picSchema);


var getPicList = function() {
	// get all document id in db

	// load all image in file system

	//  return media stream

};

var deletePic = function(elementID) {
	var imgDir = '../storage/' + elementID + '.png';

	// delete img in server file system
	fs.unlink(imgDir, function(err) {
		if (err) throw err;
		console.log('Successfully deleted ' + imgDir);
	});

	// rremove document in db
	picItem.findOneAndRemove(elementID, function(err) {
		if(err) throw err;
		console.log(elementID + ' deleted.');
	});
};

var addPic = function() {
	// create new in mongodb
	var tmpID;
	console.log('New item recieved.');

	picItem.save(function (err, data) {
		if (err) throw err;
		console.log('Created: ' + data);
		tmpID = data.id;
	});

	// return new ID
	return tmpID;
};

var changePic = function(elementID, uploadName) {
	var imgDir = './storage/' + elementID + '.png';

	// remove original img in server file system
	fs.exists(imgDir, function(exists) {
		console.log(imgDir + " exists? " + exists);
		if (exists) {
			fs.unlink(imgDir, function(err) {
				if (err) throw err;
				console.log('Successfully deleted ' + imgDir);
			});
		}
	});

	fs.rename('./storage/' + uploadName, imgDir, function(err) {
		if ( err ) throw err;
	});
};

exports.getPicList = getPicList;
exports.deletePic = deletePic;
exports.addPic = addPic;
exports.changePic = changePic;
