// // [SECTION] Dependencies and Modules
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// // Google Login
// const passport = require("passport");
// const session = require("express-session");
// const captchaRoute = require("./routes/captchaRoute");
// // require('./passport');

// // [SECTIONIS] Environment Setup
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

// const http = require("http");
const fs = require("fs");
const https = require("https");

const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo"); //Store session

const csrf = require("csurf");
const cookieParser = require("cookie-parser");
require("dotenv").config(); // Load environment variables
console.log("Loaded ENCRYPTION_KEY:", process.env.ENCRYPTION_KEY);
//[SECTION] Routes
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const newsRoutes = require("./routes/news");
const captchaRoute = require("./routes/captchaRoute");

// [SECTION] Server Setup
const app = express();

// Load SSL Certificates
const options = {
  key: fs.readFileSync("./ssl/server.key"),
  cert: fs.readFileSync("./ssl/server.cert"),
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// ✅ Enable CSRF protection
const csrfProtection = csrf({ cookie: true });

const corsOptions = {
  origin: "https://localhost:5173", // Allow frontend URL
  credentials: true, // Allow cookies & headers
  methods: "GET, POST, PUT, DELETE", // Allow specific HTTP methods
  allowedHeaders: "Content-Type, Authorization, X-XSRF-TOKEN", // Allow these headers
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

console.log("Loaded JWT Secret:", process.env.JWT_SECRET_KEY);

// [SECTION] Session Setup (Use a single session configuration)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecretKey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_STRING, // Store sessions in MongoDB
      collectionName: "sessions",
      // collectionName: "sessions",
      ttl: 3600, // Sessions expire in 1 hour
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set to true in production
      // secure: false,
      // secure: true, // only in https
      httpOnly: true, // Helps prevent XSS attacks
      sameSite: "strict", // ✅ Protects against CSRF attacks
      maxAge: 1000 * 60 * 15, // Session expiration set to 15 minutes
    },
  })
);

//  Track session last activity
app.use((req, res, next) => {
  req.session.lastActivity = Date.now();
  next();
});

// Handle session expiration on each request
app.use((req, res, next) => {
  if (
    req.session.lastActivity &&
    Date.now() - req.session.lastActivity > 15 * 60 * 1000
  ) {
    // 15 min timeout
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
    });
  }
  next();
});

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

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Credentials", "true"); // Allow cookies
//   next();
// });

// app.put("/users/reset-password", csrfProtection, (req, res, next) => {
//   next();
// });

// app.get("/users/reset-password", csrfProtection, (req, res) => {
//   res.cookie("XSRF-TOKEN", req.csrfToken(), { httpOnly: false, secure: false });
//   res.json({ csrfToken: req.csrfToken() });
// });

app.get("/users/reset-password", csrfProtection, (req, res) => {
  res.cookie("XSRF-TOKEN", req.csrfToken(), {
    httpOnly: false, // ✅ Allow frontend to read the token
    secure: process.env.NODE_ENV === "production", // ✅ Use HTTPS in production
    sameSite: "strict", // Prevent CSRF attacks
  });
  res.json({ csrfToken: req.csrfToken() });
});

app.use((req, res, next) => {
  if (req.session) {
    req.session.lastActivity = Date.now(); // ✅ Refresh session activity
  }
  next();
});

// [SECTION] Backend Routes
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use("/news", newsRoutes);
app.use("/api", captchaRoute); // Captcha route setup
// ✅ [MODIFIED] Secure Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    } else {
      res.clearCookie("connect.sid"); // ✅ Remove session cookie
      res.status(200).send({ message: "Logged out successfully" });
    }
  });
});

// Create HTTPS Server
https.createServer(options, app).listen(4000, () => {
  console.log("✅ HTTPS Server running on port 4000");
});

// Redirect HTTP to HTTPS (Optional)

// http
//   .createServer((req, res) => {
//     res.writeHead(301, {
//       Location: "https://" + req.headers["host"] + req.url,
//     });
//     res.end();
//   })
//   .listen(80, () => {
//     console.log("🚀 HTTP Server running on port 80 (Redirecting to HTTPS)");
//   });

// [SECTION] Server Gateway Response

//for HTTP
// if (require.main === module) {
//   app.listen(process.env.PORT || 3000, () => {
//     console.log(`API is now online on port ${process.env.PORT || 3000}`);
//   });
// }

// only for depolyment(HTTPS)

// https.createServer(options, app).listen(process.env.PORT || 3000, () => {
//   console.log(`🚀 Server is running on HTTPS at port ${process.env.PORT || 3000}`);
// });

// app.use((req, res, next) => {
//   if (!req.secure) {
//     return res.redirect(`https://${req.headers.host}${req.url}`);
//   }
//   next();
// });

module.exports = { app, mongoose };
