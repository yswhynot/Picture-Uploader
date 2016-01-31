var fs = require('fs');
var mongoose = require('mongoose');
var multer = require('multer');
var AdmZip = require('adm-zip');
var path = require('path');
mongoose.connect('mongodb://127.0.0.1/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('MongoDB connected.')
});

var picSchema = mongoose.Schema({date: { type: Date, default: Date.now }, name: String });
mongoose.model('picItem', picSchema);
var picItem = mongoose.model('picItem', picSchema);


var getPicList = function(callback) {
	var picArray = [];

	// get all document id in db
	picItem.find({}, function(err, eids, next) {
		if (err) throw err;
		eids.forEach(function(eid) {
			picArray.push(eid._id);
		});
		callback(picArray);
	});
};

var deletePic = function(elementID) {
	var imgDir = './storage/' + elementID + '.png';
	console.log('delete: ' + imgDir);

	// delete img in server file system
	fs.unlink(imgDir, function(err) {
		if (err) throw err;
		console.log('Successfully deleted ' + imgDir);
	});

	// rremove document in db
	picItem.findByIdAndRemove(elementID, function(err) {
		if(err) throw err;
		console.log(elementID + ' deleted.');
	});
};

var addPic = function(callback) {
	// create new in mongodb
	console.log('New item recieved.');

	var item = new picItem({name: 'upload'});
	item.save(function (err, data) {
		if (err) return console.error(err);
		console.log('Created: ' + data.id);
		callback(data.id);
	});
};

var changePic = function(elementID, uploadName) {
	var imgDir = './storage/' + elementID + '.png';

	// rename file stored
	fs.rename('./storage/' + uploadName, imgDir, function(err) {
		if ( err ) throw err;
	});
};

var zipPic = function(callback) {
	var zip = new AdmZip();
	var file = './storage/';

	zip.addLocalFolder(file);
	zip.writeZip('./pictures.zip');
	// add local file 
	// fs.readdir('./storage/', function(err, files) {
	// 	if (err) throw err;

	// 	files.map(function (file) {
	// 		return path.join('./storage/', file);
	// 	}).filter(function (file) {
	// 		return fs.statSync(file).isFile();
	// 	}).forEach(function (file) {
	// 		console.log("%s (%s)", file, path.extname(file));
	// 		zip.addLocalFile(file);
	// 	});

	// 	zip.writeZip('./pictures.zip');
	// 	console.log('finish zipping');
	// 	callback('./pictures.zip');
	// });
}

exports.getPicList = getPicList;
exports.deletePic = deletePic;
exports.addPic = addPic;
exports.changePic = changePic;
exports.zipPic = zipPic;
