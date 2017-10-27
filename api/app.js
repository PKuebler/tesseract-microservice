const express 		= require("express"),
	  bodyParser 	= require("body-parser"),
	  apiRoutes 	= require("./src/api.routes"),
	  queue 		= require("./src/queue");

// =========================
// Express
// =========================
const app = express();

// parse application/json
app.use(bodyParser.json());

// =========================
// Auth
// =========================

// =========================
// Rate Limit
// =========================

// =========================
// Queue
// =========================
app.use(queue());

// =========================
// Routes
// =========================
app.use('/api', apiRoutes);

// =========================
// Start
// =========================
app.listen(3000, function() {
	console.log("Example app listening on port 3000!");
});
