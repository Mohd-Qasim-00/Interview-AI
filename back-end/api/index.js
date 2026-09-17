require("dotenv").config();

const app = require("../src/app");
const connectDB = require("../src/config/databse");

module.exports = async function handler(req, res) {
	try {
		await connectDB();
		return app(req, res);
	} catch (error) {
		console.error("Backend startup error:", error);
		return res.status(500).json({
			message: "Backend failed to start",
			error: error.message,
		});
	}
};
