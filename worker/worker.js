const Queue = require("bee-queue"),
	fs = require("fs"),
	download = require("./src/download"),
	image = require("./src/imageprocessing"),
	Tesseract = require("./src/tesseract");

// =========================
// Queue
// =========================
const jobQueue = new Queue("ocr", {
	redis: {
		host: "redis"
	}
});

// =========================
// Tesseract
// =========================
const tesseract = Tesseract();

// =========================
// Process
// =========================
jobQueue.process((job, done) => {
	console.log(`Processing job ${job.id}`);

	return new Promise((resolve, reject) => {
		resolve(job);
	})
		.then(job => {
			// =========================
			// Download
			// =========================
			if (job.data.type == "url") {
				return download(job.data.url, "data/" + job.id + "_source", [
					"image/jpeg",
					"image/png",
					"image/tiff",
					"application/pdf"
				]).then(filename => {
					job.data.filename = filename;
					return job;
				});
			} else {
				job.data.filename = "data/" + job.data.filename;
				return job;
			}
		})
		.then(job => {
			job.data.files = { source: job.data.filename };
			return job;
		})
		.then(image)
		.then(tesseract.process)
		.then((job) => {
			// clean source
			fs.unlinkSync(job.data.files.source);
		})
		.then((job) => {
			return done(null, "success");
		})
		.catch((err) => {
			return done(err);
		});
});
