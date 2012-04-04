var fs = require('fs');
module.exports = function servejs(){
	return function jshandle(req, res, next){
		fs.readFile(req.url.substr(1), function(err, data){
			if(err){
				next(err);
				return;
			} else {
				res.simpleBody(200, data, "application/javascript");
			}
	}
}
