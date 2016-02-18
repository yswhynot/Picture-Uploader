var fs = require('fs');
var mongoose = require('mongoose');
var multer = require('multer');
var path = require('path');
var sys = require('util')
var exec = require('child_process').exec;
var child;
mongoose.connect('mongodb://127.0.0.1/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('MongoDB connected.')
});

var picSchema = mongoose.Schema({date: { type: Date, default: Date.now }, type: String, title: {type: String, default: 'None'} });
mongoose.model('picItem', picSchema);
var picItem = mongoose.model('picItem', picSchema);


var getPicList = function(callback) {
	var picArray = [];

	// get all document id in db
	picItem.find({type: 'upload'}, function(err, eids, next) {
		if (err) throw err;
		eids.forEach(function(eid) {
			picArray.push({eid: eid._id, etitle: eid.title});
		});
		callback(picArray);
	});

	// clear all none item in db
	picItem.find({type: 'none'}).remove(function(err) {
		if (err) throw err;
		console.log('db cleared.');
	});
};

var deletePic = function(eid) {
	var imgDir = './storage/' + eid + '.png';
	console.log('delete: ' + imgDir);

	// check if img exists
	fs.access(imgDir, fs.F_OK, function(err) {
		if (err)  console.log(err);
		else {
			// delete img in server file system
			fs.unlink(imgDir, function(err) {
				if (err) throw err;
				console.log('Successfully deleted ' + imgDir);
			});
		} // end else
	}); //end fs.access

	// remove item in db
	picItem.findByIdAndRemove(eid, function(err) {
		if(err) throw err;
		console.log(eid + ' deleted.');
	});
};

var addPic = function(callback) {
	// create new in mongodb
	console.log('New item recieved.');
	var item = new picItem({type: 'none', title: ''});
	item.save(function (err, data) {
		if (err) return console.error(err);
		console.log('Created: ' + data.id);
		callback(data.id);
	});
};

var changePic = function(eid, callback) {
	var imgDir = './storage/' + eid + '.png';

	// update db item
	picItem.update({ _id: eid }, {$set: { type: 'upload' }}, function(err) {
		var response = {code: 404, msg: 'original response'};
		if(err) {
			console.log(err);
			response.code = 500;
			response.msg = err;
			callback(response);
		} else {
			console.log('Update db finished.');
			response.code = 200;
			response.msg = imgDir;
			callback(response);
		}
	});
};

function generateZip(callback) {
	child = exec("zip -r pic.zip storage/", function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
		sys.print('stderr: ' + stderr);
		if (error !== null)	console.log('exec error: ' + error);
		callback('pic.zip');
	});
}

var zipPic = function(callback) {
	// check zip file exists
	fs.access('pic.zip', fs.F_OK, function(err) {
		if (err) {
			console.log(err);
			generateZip(function(zipFile) {
				callback(zipFile);
			});
		}
		else {
			// delete file if exists
			fs.unlink('pic.zip', function(err) {
				if (err) throw err;
				generateZip(function(zipFile) {
					callback(zipFile);
				});
			}); 
		} // end else
	}); // end fs.access
}

var updateTitle = function(eid, etitle) {
	// update db item
	picItem.update({ _id: eid }, {$set: { title: etitle }}, function() {
		console.log('Update title done.');
	});
};

exports.getPicList = getPicList;
exports.deletePic = deletePic;
exports.addPic = addPic;
exports.changePic = changePic;
exports.zipPic = zipPic;
exports.updateTitle = updateTitle;
