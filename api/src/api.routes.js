const express = require("express"),
	validUrl = require("valid-url"),
	multer = require("multer"),
	fs = require("fs"),
	path = require("path"),
	uuid = require("uuid");

const router = express.Router();

// =========================
// Upload
// =========================
const storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, __dirname + "/../data");
	},
	filename: function(req, file, callback) {
		callback(null, uuid.v4() + path.extname(file.originalname));
	}
});

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		const acceptTypes = [
			"image/jpeg",
			"image/png",
			"image/tiff",
			"application/pdf"
		];

		if (acceptTypes.indexOf(file.mimetype) == -1) {
			return cb(null, false);
		}

		cb(null, true);
	}
}).single("file");

// =========================
// Validate Options
// =========================
function validateOptions(fields) {
	const options = {
		langs: "deu",
		formats: ["txt"],
		contrast: 0.7
	};

	if (fields.formats && Array.isArray(fields.formats)) {
		options.formats = fields.formats.filter(format => {
			return ["hocr", "txt", "pdf", "tsv"].indexOf(format) > -1;
		});
	}

	if (
		fields.contrast &&
		Number(fields.contrast) === fields.contrast &&
		fields.contrast >= 0 &&
		fields.contrast <= 1
	) {
		options.contrast = fields.contrast;
	}

	// psm 6
	// oem 2

	if (fields.langs && Array.isArray(fields.langs)) {
		options.langs = fields.formats
			.filter(lang => {
				return ["deu", "eng"].indexOf(lang) > -1;
			})
			.join("+");
	}

	return options;
}

// =========================
// Response
// =========================

// =========================
// Load from URL
// =========================
router.post("/url", function(req, res) {
	if (!req.body.hasOwnProperty("url")) {
		return res.json({ status: "error", msg: "need field 'url'." });
	}

	// =========================
	// Validate URL
	// =========================
	if (!validUrl.isUri(req.body.url)) {
		return res.json({ status: "error", msg: "need a valid url." });
	}

	// =========================
	// Options
	// =========================
	const options = validateOptions(req.body);

	// =========================
	// Add Queue
	// =========================
	req
		._addQueue({
			type: "url",
			url: req.body.url,
			options
		})
		.then(job => {
			job.on("succeeded", result => {
				console.log(`Job ${job.id} succeeded with result: ${result}`);

				const response = { status: "success" };

				options.formats.forEach(format => {
					response[format] = fs
						.readFileSync("data/" + job.id + "." + format)
						.toString();

					fs.unlinkSync("data/" + job.id + "." + format);
				});

				// edit
				fs.unlinkSync("data/" + job.id + ".png");
			});
		});
});

// =========================
// Incoming File
// =========================
router.post("/file", upload, function(req, res) {
	// =========================
	// Check File
	// =========================
	if (!req.file) {
		return res.json({
			status: "error",
			msg: "missing file"
		});
	}

	// =========================
	// Options
	// =========================
	const options = validateOptions(req.body);

	// =========================
	// Add Queue
	// =========================
	req
		._addQueue({
			type: "file",
			filename: req.file.filename,
			options: options
		})
		.then(job => {
			job.on("succeeded", result => {
				console.log(`Job ${job.id} succeeded with result: ${result}`);

				const response = { status: "success" };

				options.formats.forEach(format => {
					response[format] = fs
						.readFileSync("data/" + job.id + "." + format)
						.toString();

					fs.unlinkSync("data/" + job.id + "." + format);
				});

				// edit
				fs.unlinkSync("data/" + job.id + ".png");

				res.json(response);
			});
		});
});

module.exports = router;
