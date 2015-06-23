var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var exec = require('child_process').exec;

var http = require('http');
var utf8 = require('utf8');


//Express's powerful parser

router.use(multer({
	dest: "./uploads/"
	// ,
	// rename: function (fieldname, filename) {
	// 	console.log(res.body.uid);
	// 	return filename;
	// }
}));

router.post('/', function(req, res){
	
	var fullPath = req.files.image.path;

	exec('tesseract '+fullPath+' '+fullPath+'_out -l eng+hin', function (error, stdout, stderr) {

		fs.readFile(fullPath+'_out.txt', 'utf-8', function(err, data){
			if(err==null){
				fs.unlink(fullPath);
				fs.unlink(fullPath+'_out.txt');
				// var trpath = 'https://translate.google.co.in/translate_a/single?client=t&dt=t&sl=hi&tl=en&q='+data.trim();
				var trpath = 'https://translate.google.co.in/translate_a/single?client=t&dt=t&sl=hi&tl=en&ie=UTF-8&oe=UTF-8&q='+encodeURIComponent(data.trim());
				// var trpath = 'https://translate.google.co.in/translate_a/single?client=t&dt=t&sl=hi&tl=en&ie=UTF-8&oe=UTF-8';

				// var trpath = '/translate_a/single?client=t&dt=t&sl=en&tl=hi&q=soft'
				console.log(trpath);
				var query = {
					q: data.trim()
				};
				
				var request = require('request');
				request.post(trpath, function (error, response, body) {
				  if (!error && response.statusCode == 200) {
				  	console.log(body);
				  	body = body.replace(",,",",");
				  	var translated = JSON.parse(body);
				  	var translation = translated[0][0][0];
				    console.log(translation);
				    res.send({status:'success', ocr: data.trim(), trans: translation});
				  }
				  else{
				  	res.send({status:'failure'});
				  }
				});

			}
			else{
				res.send({status:'failure'});
			}
		});
		
	  // output is in stdout
	});

	
});

module.exports = router;
