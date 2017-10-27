var fs = require("fs"),
	request = require("request"),
	mime = require('mime-types');

var download = function(uri, filename, acceptTypes) {
	return new Promise((resolve, reject) => {

		request.head(uri, function(err, res, body) {
			const extension = mime.extension(res.headers["content-type"]);

			console.log("content-type:", res.headers["content-type"]);
			console.log("content-length:", res.headers["content-length"]);

			if (acceptTypes.indexOf(res.headers["content-type"]) == -1) {
				return reject("content-type not accepted");
			}

			request(uri).pipe(fs.createWriteStream(filename + "." + extension)).on("close", () => {
				resolve(filename + "." + extension);
			});
		});
	});
};

module.exports = download;
