const Queue = require("bee-queue");

module.exports = function() {
	const jobQueue = new Queue("ocr", {
		redis: {
			host: "redis"
		},
		isWorker: false
	});

	return (req, res, next) => {
		req._addQueue = function(data) {
			return jobQueue.createJob(data)
			  .timeout(1000*60*2)
			  .retries(2)
			  .save();
		}

		next();
	};
};
