const { exec } = require("child_process"),
	fs = require("fs");

// =========================
// Tesseract CMD
// =========================
function Tesseract() {
	const options = {
		psm: "6",
		oem: "2"
		//["txt", "pdf", "hocr", "tsv"]
	};

	// =========================
	// Process
	// =========================
	function process(job) {
		const identifier = "data/" + job.id;
		return new Promise((resolve, reject) => {
			exec(
				"tesseract " +
					job.data.files.img +
					" " +
					identifier +
					" -l " +
					job.data.options.langs +
					"  --psm " +
					options.psm +
					" --oem " +
					options.oem +
					" " +
					job.data.options.formats.join(" "),
				(err, stdout, stderr) => {
					if (err) {
						console.log(err);
						reject(err);
						return;
					}

					console.log(identifier);

					job.data.options.formats.forEach(format => {
						job.data.files[format] = identifier + "." + format;
					});

					// finish
					resolve(job);
				}
			);
		});
	}

	return {
		process
	};
}

module.exports = Tesseract;
