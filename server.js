const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParses = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
//Load env vars
dotenv.config({ path: "./config/config.env" });
//Connect to DB
connectDB();
//Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}
//File Uploading
app.use(fileupload());
//Sanitize data
app.use(mongoSanitize());
//Set security headers
app.use(helmet({ contentSecurityPolicy: false }));
//Prevent Cross site scripting attacks
app.use(xss());
//Rate limiting
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, //10 minutes
	max: 100,
});
app.use(limiter);
//Prevent HTTP Param Polution
app.use(hpp());
//Enable CORS
app.use(cors());
//Cookie Parser
app.use(cookieParser());
//Set static folder
app.use(express.static(path.join(__dirname, "public")));
//Mount Routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
const server = app.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
			.yellow.bold
	)
);
//Handle Unhandled Rejections
process.on("unhandledRejection", (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	//Close Server and exit process
	server.close(() => {
		process.exit(1);
	});
});
