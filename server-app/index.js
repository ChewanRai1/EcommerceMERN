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

//2nd Auto crashing backend
// const http = require("http");
const fs = require("fs");
const https = require("https");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const newsRoutes = require("./routes/news");
const captchaRoute = require("./routes/captchaRoute");
const sessionMiddleware = require("./middleware/sessionMiddleware");

const app = express();
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");

app.use(helmet());
// Use mongo-sanitize middleware
app.use(mongoSanitize());
app.use(xssClean()); // ✅ Protects against XSS attacks

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const logger = require("./utils/logger");
const activityLogger = require("./middleware/activityLogger");

app.use(activityLogger);

const corsOptions = {
  origin: "https://localhost:5173", // Allow frontend URL
  credentials: true, // Allow cookies & headers
  methods: "GET, POST, PUT, DELETE", // Allow specific HTTP methods
  allowedHeaders: "Content-Type, Authorization, X-XSRF-TOKEN", // Allow these headers
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// ✅ **MongoDB Connection**
mongoose
  .connect(process.env.MONGODB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas."))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// app.use((req, res, next) => {
//   if (req.session && req.session.userId) {
//     const now = Date.now();

//     // Auto-logout after 1 min of inactivity
//     if (
//       req.session.lastActivity &&
//       now - req.session.lastActivity > 1000 * 60 * 2
//     ) {
//       console.log("🔴 Session expired, logging out user...");

//       req.session.destroy((err) => {
//         if (err) {
//           console.error("Session destruction error:", err);
//         }
//       });

//       res.clearCookie("connect.sid", { path: "/" });
//       return res
//         .status(401)
//         .json({ message: "Session expired. Please log in again." });
//     }

//     req.session.lastActivity = now; // ✅ Refresh session activity timestamp
//   }
//   next();
// });
// app.use((req, res, next) => {
//   if (!req.session || !req.session.userId) {
//     res.clearCookie("connect.sid", { path: "/" }); // Ensure cookie is removed
//     return res.status(401).json({ message: "Session expired. Please log in again." });
//   }

//   const now = Date.now();
//   if (req.session.lastActivity && now - req.session.lastActivity > 1000 * 60 * 2) { // 2 min timeout
//     console.log("🔴 Session expired due to inactivity, logging out user...");

//     req.session.destroy((err) => {
//       if (err) console.error("Session destruction error:", err);
//     });

//     res.clearCookie("connect.sid", { path: "/" });
//     return res.status(401).json({ message: "Session expired. Please log in again." });
//   }

//   req.session.lastActivity = now; // ✅ Update last activity timestamp
//   next();
// });

// [SECTION] Session Setup (Use a single session configuration)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecretKey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_STRING, // Store sessions in MongoDB
      collectionName: "sessions",
      ttl: 60 * 60, // Sessions expire in 1 hr
      autoRemove: "interval",
      autoRemoveInterval: 1, // Remove expired sessions every 1 minute
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set to true in production
      // secure: false,
      // secure: true, // only in https
      httpOnly: true, // Helps prevent XSS attacks
      sameSite: "strict", // ✅ Protects against CSRF attacks
      maxAge: 1000 * 60 * 60, // Session expiration set to 1 hr
    },
    // unset: "destroy", // ✅ Ensures session is properly destroyed
  })
);
app.use("/api", captchaRoute); // Captcha route setup
//  Track session last activity
app.use((req, res, next) => {
  if (req.session) {
    req.session.lastActivity = Date.now();
  }
  next();
});
// ✅ **Auto-Logout Middleware (Handled Here Instead of sessionMiddleware)**
app.use((req, res, next) => {
  if (
    req.session &&
    req.session.lastActivity &&
    Date.now() - req.session.lastActivity > 1000 * 60 * 2 // 2 minutes
  ) {
    console.log("🔴 Session expired due to inactivity, logging out user...");

    req.session.destroy((err) => {
      if (err) console.error("Error destroying session:", err);
    });

    res.clearCookie("connect.sid", { path: "/" });
    return res
      .status(401)
      .json({ message: "Session expired. Please log in again." });
  }
  next();
});

app.use("/users", userRoutes);

// [SECTION] Backend Routes

app.use("/courses", courseRoutes);
app.use("/news", newsRoutes);
app.use(sessionMiddleware);
// ✅ **Secure Logout Route**
app.get("/logout", (req, res) => {
  if (!req.session) {
    return res.status(400).json({ message: "No active session found." });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Error destroying session:", err);
      return res.status(500).json({ message: "Logout failed." });
    }

    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    console.log("✅ User logged out, session destroyed.");
    res.status(200).json({ message: "Logged out successfully." });
  });
});

// // Handle session expiration on each request
// app.use((req, res, next) => {
//   if (
//     req.session.lastActivity &&
//     Date.now() - req.session.lastActivity > 15 * 60 * 1000
//   ) {
//     // 15 min timeout
//     req.session.destroy((err) => {
//       if (err) {
//         console.error("Error destroying session:", err);
//       }
//     });
//   }
//   next();
// });

// [Section] Google Login Setup
app.use(passport.initialize());
app.use(passport.session());

// [SECTION] Database Connection
// mongoose.connect(process.env.MONGODB_STRING, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// mongoose.connection.once("open", () =>
//   console.log("Now connected to MongoDB Atlas.")
// );

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

// ✅ Enable CSRF protection
// const csrfProtection = csrf({ cookie: true });
// app.get("/users/reset-password", csrfProtection, (req, res) => {
//   res.cookie("XSRF-TOKEN", req.csrfToken(), {
//     httpOnly: false, // ✅ Allow frontend to read the token
//     secure: process.env.NODE_ENV === "production", // ✅ Use HTTPS in production
//     sameSite: "strict", // Prevent CSRF attacks
//   });
//   res.json({ csrfToken: req.csrfToken() });
// });

// app.use((req, res, next) => {
//   if (req.session) {
//     req.session.lastActivity = Date.now(); // ✅ Refresh session activity
//   }
//   next();
// });

// ✅ [MODIFIED] Secure Logout Route
// app.get("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       console.error("Error destroying session:", err);
//       return res.status(500).json({ message: "Error logging out" });
//     } else {
//       res.clearCookie("connect.sid"); // ✅ Remove session cookie
//       // res.clearCookie("connect.sid", { path: "/" }); // ✅ Force delete session cookie
//       res.status(200).send({ message: "Logged out successfully" });
//     }
//   });
// });
// app.get("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       console.error("❌ Error destroying session:", err);
//       return res.status(500).send({ message: "Logout failed" });
//     }

//     // ✅ Ensure cookie is removed properly
//     res.clearCookie("connect.sid", {
//       path: "/",
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//     });

//     console.log("✅ User logged out, session destroyed.");
//     res.status(200).send({ message: "Logged out successfully" });
//   });
// });

// Load SSL Certificates
const options = {
  key: fs.readFileSync("./ssl/server.key"),
  cert: fs.readFileSync("./ssl/server.cert"),
};

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

//3rd

// const fs = require("fs");
// const https = require("https");
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const passport = require("passport");
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
// const cookieParser = require("cookie-parser");
// require("dotenv").config();

// const userRoutes = require("./routes/user");
// const courseRoutes = require("./routes/course");
// const newsRoutes = require("./routes/news");
// const captchaRoute = require("./routes/captchaRoute");
// const sessionMiddleware = require("./middleware/sessionMiddleware");

// const app = express();
// const helmet = require("helmet");
// const xssClean = require("xss-clean");

// // ✅ Security Enhancements
// app.use(helmet());
// app.use(xssClean());

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// const logger = require("./utils/logger");
// const activityLogger = require("./middleware/activityLogger");

// app.use(activityLogger);

// // ✅ CORS Configuration
// const corsOptions = {
//   origin: "https://localhost:5173",
//   credentials: true,
//   methods: "GET, POST, PUT, DELETE",
//   allowedHeaders: "Content-Type, Authorization",
//   optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

// // ✅ MongoDB Connection
// const MONGO_OPTIONS = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 5000,
//   socketTimeoutMS: 45000,
//   retryWrites: true,
//   maxPoolSize: 10, // Keep a balanced connection pool
//   minPoolSize: 2,
// };

// mongoose
//   .connect(process.env.MONGODB_STRING, MONGO_OPTIONS)
//   .then(() => console.log("✅ Connected to MongoDB Atlas."))
//   .catch((err) => {
//     console.error("❌ MongoDB Connection Error:", err);
//     process.exit(1); // Stop the app if the database fails to connect
//   });

// mongoose.connection.on("disconnected", () => {
//   console.warn("⚠️ MongoDB Disconnected! Reconnecting...");
//   setTimeout(() => {
//     mongoose.connect(process.env.MONGODB_STRING, MONGO_OPTIONS);
//   }, 5000);
// });

// // ✅ Session Configuration
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "defaultSecretKey",
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGODB_STRING,
//       collectionName: "sessions",
//       ttl: 60 * 2,
//       autoRemove: "interval",
//       autoRemoveInterval: 1,
//     }),
//     cookie: {
//       secure: process.env.NODE_ENV === "production",
//       httpOnly: true,
//       sameSite: "strict",
//       maxAge: 1000 * 60 * 2,
//     },
//   })
// );

// // ✅ Ensure CAPTCHA Works Before Applying Session Middleware
// app.use("/api", captchaRoute);

// // ✅ Apply Session Middleware Only After CAPTCHA
// app.use(sessionMiddleware);

// // ✅ Auto-Logout Middleware (Fixes Auto Logout Issue)
// app.use((req, res, next) => {
//   if (!req.session || !req.session.userId) {
//     res.clearCookie("connect.sid", { path: "/" });
//     return res
//       .status(401)
//       .json({ message: "Session expired. Please log in again." });
//   }

//   const now = Date.now();
//   if (
//     req.session.lastActivity &&
//     now - req.session.lastActivity > 1000 * 60 * 2
//   ) {
//     console.log("🔴 Session expired due to inactivity, logging out user...");

//     req.session.destroy((err) => {
//       if (err) console.error("Session destruction error:", err);
//     });

//     res.clearCookie("connect.sid", { path: "/" });
//     return res
//       .status(401)
//       .json({ message: "Session expired. Please log in again." });
//   }

//   req.session.lastActivity = now;
//   next();
// });

// // ✅ Routes
// app.use("/users", userRoutes);
// app.use("/courses", courseRoutes);
// app.use("/news", newsRoutes);

// // ✅ Secure Logout Route
// app.get("/logout", (req, res) => {
//   if (!req.session) {
//     return res.status(400).json({ message: "No active session found." });
//   }

//   req.session.destroy((err) => {
//     if (err) {
//       console.error("❌ Error destroying session:", err);
//       return res.status(500).json({ message: "Logout failed." });
//     }

//     res.clearCookie("connect.sid", {
//       path: "/",
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//     });

//     console.log("✅ User logged out, session destroyed.");
//     res.status(200).json({ message: "Logged out successfully." });
//   });
// });

// // ✅ Load SSL Certificates
// const options = {
//   key: fs.readFileSync("./ssl/server.key"),
//   cert: fs.readFileSync("./ssl/server.cert"),
// };

// // ✅ Create HTTPS Server
// https.createServer(options, app).listen(4000, () => {
//   console.log("✅ HTTPS Server running on port 4000");
// });

// module.exports = { app, mongoose };
