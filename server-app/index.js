// // [SECTION] Dependencies and Modules
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// // Google Login
// const passport = require("passport");
// const session = require("express-session");
// const captchaRoute = require("./routes/captchaRoute");
// // require('./passport');

// // [SECTION] Environment Setup
// // const port = 4000;
// require("dotenv").config();

// //[SECTION] Routes
// const userRoutes = require("./routes/user");
// //[SECTION] Activity: Allows access to routes defined within our application
// const courseRoutes = require("./routes/course");
// const newsRoutes = require("./routes/news");

// // [SECTION] Server Setup
// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(
//   session({
//     secret: "CourseBookingAPI",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// require("dotenv").config();  // Load environment variables

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "defaultSecretKey",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === "production",  // Set to true in production
//       httpOnly: true,  // Helps prevent XSS attacks
//       maxAge: 1000 * 60 * 15  // Session expiration set to 15 minutes
//     },
//   })
// );


// const corsOptions = {
//   origin: ["http://localhost:5173"],
//   credentials: true,
//   optionsSuccessStatus: 200,
// };

// app.use(cors());

// // [Section] Google Login
// // Creates a session with the given data
// // resave prevents the session from overwriting the secret while the session is active
// // saveUninitialized prevents the data from storing data in the session while the data has not yet been initialized
// app.use(
//   session({
//     secret: process.env.clientSecret || "CourseBookingAPI",
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false }, // Set to true if using HTTPS
//   })
// );

// // Initializes the passport package when the application runs
// app.use(passport.initialize());
// // Creates a session using the passport package
// app.use(passport.session());

// //[SECTION] Database Connection
// //courseBookingAPI - no data
// //booking-KT - with data
// mongoose.connect(process.env.MONGODB_STRING, {
//   useNewUrlParser: true, //both can be omitted since this will be deprecated in the next version
//   useUnifiedTopology: true,
// });

// mongoose.connection.once("open", () =>
//   console.log("Now connected to MongoDB Atlas.")
// );

// // general routes for user requests and course requests
// //[SECTION] Backend Routes
// //http://localhost:4000/users
// app.use("/users", userRoutes);
// //[SECTION] Activity: Add course routes
// app.use("/courses", courseRoutes);
// app.use("/news", newsRoutes);

// //for captcha

// app.use("/api", captchaRoute);

// // [SECTION] Server Gateway Response
// if (require.main === module) {
//   app.listen(process.env.PORT || 3000, () => {
//     console.log(`API is now online on port ${process.env.PORT || 3000}`);
//   });
// }

// module.exports = { app, mongoose };


// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const captchaRoute = require("./routes/captchaRoute");
require("dotenv").config();  // Load environment variables

//[SECTION] Routes
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const newsRoutes = require("./routes/news");

// [SECTION] Server Setup
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// [SECTION] Session Setup (Use a single session configuration)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",  // Set to true in production
      httpOnly: true,  // Helps prevent XSS attacks
      maxAge: 1000 * 60 * 15  // Session expiration set to 15 minutes
    },
  })
);

// [SECTION] CORS Setup
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// [Section] Google Login Setup
app.use(passport.initialize());
app.use(passport.session());

// [SECTION] Database Connection
mongoose.connect(process.env.MONGODB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas.")
);

// [SECTION] Backend Routes
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use("/news", newsRoutes);
app.use("/api", captchaRoute);  // Captcha route setup

// [SECTION] Server Gateway Response
if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`API is now online on port ${process.env.PORT || 3000}`);
  });
}

module.exports = { app, mongoose };
