const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;
	//Log in the console
	console.log();
	//Mongoose bad object ID
	if (err.name === "CastError") {
		const message = `Resource not found`;
		error = new ErrorResponse(message, 404);
	}
	//Mongoose Duplicate key
	if (err.code === 11000) {
		const message = "Duplicate field value entered";
		error = new ErrorResponse(message, 400);
	}
	//Mongoose Validation error
	if (err.name === "ValidationError") {
		const message = Object.values(err.errors);
		error = new ErrorResponse(message, 400);
	}
	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || "Server Error!",
	});
};
module.exports = errorHandler;
