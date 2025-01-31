//[SECTION] Dependencies and Modules
const express = require("express");

const userController = require("../controllers/user");
const auth = require("../auth");
//Google Login
const passport = require("passport");

const { verify, isLoggedIn } = auth;

//[SECTION] Routing Component

const csrf = require("csurf");
const router = express.Router();
const csrfProtection = csrf({ cookie: true }); // ✅ CSRF protection

// Routes for duplicate email
router.post("/checkEmail", userController.checkEmailExists);

//[SECTION] Route for user registration
router.post("/register", userController.registerUser);
// ✅ Add a GET route to fetch CSRF token
// router.get("/reset-password", csrfProtection, (req, res) => {
//   res.cookie("XSRF-TOKEN", req.csrfToken(), { httpOnly: false, secure: false });
//   res.json({ csrfToken: req.csrfToken() });
// });

// // Reset password (Enforces expiry & reuse prevention)
// // router.put("/reset-password", auth.verify, userController.resetPassword);
// // ✅ Secure Password Reset Route
// router.put("/reset-password", csrfProtection, userController.resetPassword);

// ✅ Fetch CSRF Token
router.get("/reset-password", csrfProtection, (req, res) => {
  res.cookie("XSRF-TOKEN", req.csrfToken(), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ csrfToken: req.csrfToken() });
});

// ✅ Update Reset Password Route
router.put("/reset-password", csrfProtection, userController.resetPassword);


// Forgot Password Route
router.post("/forgot-password", userController.forgotPassword);

router.put("/change-password", userController.changePassword);
router.post("/verify-otp", userController.verifyOTP);

//[SECTION] Route for user authentication
router.post("/login", userController.loginUser);

// Route for retrieving user details
router.get("/details", verify, userController.getProfile);

//[SECTION] Route to enroll user to a course
router.post("/enroll", verify, userController.enroll);

// Route to get the user's enrollements array
router.get("/getEnrollments", verify, userController.getEnrollments);

// ✅ [MODIFIED] Secure Logout Route (Clears JWT & Session)
router.get("/logout", auth.logoutUser);

//[SECTION] Google Login
//[SECTION] Route for initiating the Google OAuth consent screen
router.get(
  "/google",
  // Uses the "authenticate" method of passport to verify the email credentials in Google's APIs
  passport.authenticate("google", {
    // Scopes that are allowed when retriving user data
    scope: ["email", "profile"],
    // Allows the OAuth consent screen to be "prompted" when the route is accessed to select a new account every time the user tries to login.
    // Comment this out and access this route twice to see the difference
    // If removed, automatically redirects the user to "/google/success" route
    // If added, always returns the OAuth consent screen to allow the user to choose an account
    prompt: "select_account",
  })
);

//[SECTION] Route for callback URL for Google OAuth authentication
router.get(
  "/google/callback",
  // If authentication is unsuccessful, redirect to "/users/failed" route
  passport.authenticate("google", {
    failureRedirect: "/users/failed",
  }),
  // If authentication is successful, redirect to "/users/success" route
  function (req, res) {
    res.redirect("/users/success");
  }
);

//[SECTION] Route for failed Google OAuth authentication
router.get("/failed", (req, res) => {
  console.log("User is not authenticated");
  res.send("Failed");
});

//[SECTION] Route for successful Google OAuth authentication
router.get("/success", isLoggedIn, (req, res) => {
  console.log("You are logged in");
  console.log(req.user);
  res.send(`Welcome ${req.user.displayName}`);
});

//This is through auth.js
//[SECTION] Route for logging out of the application
// The logout route does only logs the user out of the application and destroys the session, but upon trying to access the "/google" route again, the user is no longer prompted to choose an email to login if the "prompt : "select_account" option is not added to the "/google" route. This is expected behaviour because the Google OAuth 2, already allows the user access to the "Course Booking API" because the user has been authorized to access the app.
// Navigate to the Google App Permissions to delete all connections with the app (https://myaccount.google.com/connections)
// router.get("/logout", (req, res) => {
//   // Destroys the session that stores the Google OAuth Client credentials
//   // Allows for release of resources when the account information is no longer needed in the browser
//   req.session.destroy((err) => {
//     if (err) {
//       console.log("Error while destroying session:", err);
//     } else {
//       req.logout(() => {
//         console.log("You are logged out");
//         // Redirects the page to "http://localhost:4000" route to visual redirection in frontend.
//         // Can be replaced in the future with the "home" page route for the frontend.
//         res.redirect("/");
//       });
//     }
//   });
// });

//[SECTION] Route for resetting the user password
// router.put("/reset-password", verify, userController.resetPassword);

//[SECTION] Route for updating user profile
// Update authMiddleware.authenticateToken to our own auth module and use verify instead.
// Update profileController to userController, our own controller module instead.
router.put("/profile", verify, userController.updateProfile);

//[SECTION] Export Route System
module.exports = router;
