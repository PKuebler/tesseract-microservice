const Jimp = require("jimp");

// =========================
// Optimize
// =========================
module.exports = function(job) {
	return new Promise((resolve, reject) => {
		return Jimp.read(job.data.files.source).then(image => {
			image
				.quality(100)
				.scale(2)
				.contrast(job.data.options.contrast)
				.greyscale()
				.write("data/" + job.id + ".png", resolve);
		});
	}).then(() => {
		job.data.files.img = "data/" + job.id + ".png";

		return job;
	});
};
