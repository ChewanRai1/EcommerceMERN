//[SECTION] Dependencies and Modules
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const auth = require("../auth");

const { sendOTPEmail } = require("../utils/emailService");
// const bcrypt = require("bcryptjs");
const { sendResetEmail } = require("../utils/emailService");
const { hashEmail, encrypt, decrypt } = require("../utils/security");

const { errorHandler } = auth;
// const { encrypt, decrypt, hashEmail } = require("../utils/security");

const PASSWORD_EXPIRY_DAYS = 90;
const PREVIOUS_PASSWORD_LIMIT = 3;

// Define password complexity regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const logger = require("../utils/logger");
//[SECTION] Check if the email already exists
/*
    Steps: 
    1. Use mongoose "find" method to find duplicate emails
    2. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
// */
// module.exports.checkEmailExists = (req, res) => {
//   if (req.body.email.includes("@")) {
//     return User.find({ email: req.body.email })
//       .then((result) => {
//         if (result.length > 0) {
//           return res.status(409).send({ message: "Duplicate email found" });
//         } else {
//           return res.status(404).send({ message: "No duplicate email found" });
//         }
//       })
//       .catch((error) => errorHandler(error, req, res));
//   } else {
//     res.status(400).send({ message: "Invalid email format" });
//   }
// };

// Check encrypted email
// ✅ **Check Email Exists (Using Hashed Email)**
module.exports.checkEmailExists = async (req, res) => {
  try {
    const hashedEmail = hashEmail(req.body.email);
    const user = await User.findOne({ hashedEmail });

    if (user) {
      return res.status(409).send({ message: "Duplicate email found" });
    }
    return res.status(404).send({ message: "No duplicate email found" });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

//[SECTION] User registration
/*
    Steps:
    1. Create a new User object using the mongoose model and the information from the request body
    2. Make sure that the password is encrypted
    3. Save the new User to the database
*/
// module.exports.registerUser = (req, res) => {
//   // Checks if the email is in the right format
//   if (!req.body.email.includes("@")) {
//     // if the email is not in the right format, send a message 'Invalid email format'.
//     return res.status(400).send({ message: "Invalid email format" });
//   }
//   // Checks if the mobile number has the correct number of characters
//   else if (req.body.mobileNo.length !== 10) {
//     // if the mobile number is not in the correct number of characters, send a message 'Mobile number is invalid'.
//     return res.status(400).send({ message: "Mobile number is invalid" });
//   }
//   // Checks if the password has atleast 8 characters
//   else if (req.body.password.length < 8) {
//     // If the password is not atleast 8 characters, send a message 'Password must be atleast 8 characters long'.
//     return res
//       .status(400)
//       .send({ message: "Password must be atleast 8 characters long" });
//     // If all needed requirements are achieved
//   } else {
//     let newUser = new User({
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       email: req.body.email,
//       mobileNo: req.body.mobileNo,
//       password: bcrypt.hashSync(req.body.password, 10),
//     });

//     return (
//       newUser
//         .save()
//         // if all needed requirements are achieved, send a success message 'User registered successfully' and return the newly created user.
//         .then((result) =>
//           res.status(201).send({
//             message: "User registered successfully",
//             user: result,
//           })
//         )
//         .catch((error) => errorHandler(error, req, res))
//     );
//   }
// };
// **User Registration**
// module.exports.registerUser = async (req, res) => {
//   const { firstName, lastName, email, mobileNo, password } = req.body;

//   if (!email.includes("@")) {
//     return res.status(400).send({ message: "Invalid email format" });
//   }
//   if (mobileNo.length !== 10 || !/^\d+$/.test(mobileNo)) {
//     return res
//       .status(400)
//       .send({ message: "Mobile number must be 10 digits long" });
//   }
//   if (!passwordRegex.test(password)) {
//     return res.status(400).send({
//       message:
//         "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.",
//     });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       firstName,
//       lastName,
//       email,
//       mobileNo,
//       password: hashedPassword,
//       passwordChangedAt: Date.now(),
//     });

//     await newUser.save();
//     res.status(201).send({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).send({ message: "Error registering user", error });
//   }
// };

//For encrypting email and phone
// ✅ **Register User**
// **✅ User Registration (Ensuring Encrypted Storage & Hashed Email Uniqueness)**
module.exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, mobileNo, password } = req.body;

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).send({ message: "Invalid email format" });
    }
    if (mobileNo.length !== 10 || !/^\d+$/.test(mobileNo)) {
      return res
        .status(400)
        .send({ message: "Mobile number must be 10 digits long" });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).send({
        message:
          "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedEmail = hashEmail(email);
    const encryptedEmail = encrypt(email);
    const encryptedMobile = encrypt(mobileNo);

    // ✅ Check if email already exists
    if (await User.findOne({ hashedEmail })) {
      return res.status(409).send({ message: "Duplicate email found" });
    }

    const newUser = new User({
      firstName,
      lastName,
      hashedEmail,
      email: encryptedEmail,
      mobileNo: encryptedMobile,
      password: hashedPassword,
      passwordChangedAt: Date.now(), // ✅ Added back to track password updates
    });

    await newUser.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res
      .status(500)
      .send({ message: "Error registering user", error: error.message });
  }
};

// **Password Reset with Reuse Prevention**

module.exports.resetPassword = async (req, res) => {
  try {
    console.log("Received CSRF Token:", req.headers["x-xsrf-token"]);
    console.log("Stored CSRF Token:", req.cookies["XSRF-TOKEN"]);
    console.log("Session CSRF Token:", req.csrfToken());
    console.log("✅ Session data at password reset:", req.session); // CHECK SESSION
    // if (!req.session.userId) {
    //   return res
    //     .status(401)
    //     .json({ message: "Unauthorized request. Please log in again." });
    // }
    if (!req.session.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized request. Please log in again." });
    }

    // ✅ Compare CSRF token with stored cookie value
    if (req.headers["x-xsrf-token"] !== req.cookies["XSRF-TOKEN"]) {
      return res.status(403).json({ message: "Invalid CSRF token" });
    }

    const { newPassword } = req.body;
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // ✅ Hash and save new password
    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("❌ Password Reset Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const OTP_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes

module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const hashedEmail = hashEmail(email);

    // Generate OTP and expiry
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    console.log("🔹 Generated OTP:", otp);

    // ✅ Use `findOneAndUpdate` with `{ upsert: false }`
    const user = await User.findOneAndUpdate(
      { hashedEmail },
      { $set: { resetOTP: otp, otpExpiry: expiry } },
      { new: true } // Return updated document
    );

    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Updated User:", user);

    await sendOTPEmail(decrypt(user.email), otp);
    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.changePassword = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // ✅ Extract Token

    if (!token)
      return res.status(401).json({ message: "Unauthorized request" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user)
      return res.status(404).json({ message: "Invalid or expired token" });

    const { newPassword } = req.body;

    // Password validation
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(newPassword)) {
      return res.status(400).json({
        message:
          "Weak password. Use at least 8 chars, 1 uppercase, 1 number, 1 special char.",
      });
    }

    // Prevent password reuse
    if (
      user.previousPasswords.some((pwd) => bcrypt.compareSync(newPassword, pwd))
    ) {
      return res
        .status(400)
        .json({ message: "Cannot reuse previous passwords" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.previousPasswords.push(user.password);

    if (user.previousPasswords.length > 3) user.previousPasswords.shift();

    user.password = hashedPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Change Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const hashedEmail = hashEmail(email);

    const user = await User.findOne({ hashedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.resetOTP || Number(user.resetOTP) !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > new Date(user.otpExpiry)) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15m", // Token expires in 15 minutes
    });

    // Clear OTP fields after verification
    user.resetOTP = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "OTP verified.", token });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//[SECTION] User authentication
/*
    Steps:
    1. Check the database if the user email exists
    2. Compare the password provided in the login form with the password stored in the database
    3. Generate/return a JSON web token if the user is successfully logged in and return false if not
*/
// **✅ User Login with Hashed Email Lookup**
// module.exports.loginUser = async (req, res) => {
//   try {
//     const hashedEmail = hashEmail(req.body.email);
//     const user = await User.findOne({ hashedEmail });

//     if (!user) {
//       return res.status(404).send({ message: "Email does not exist" });
//     }

//     const isPasswordCorrect = bcrypt.compareSync(
//       req.body.password,
//       user.password
//     );
//     if (!isPasswordCorrect) {
//       return res.status(401).send({ message: "Incorrect email or password" });
//     }

//     res.status(200).send({
//       message: "User logged in successfully",
//       access: auth.createAccessToken(user),
//     });
//   } catch (error) {
//     console.error("❌ Login Error:", error);
//     res.status(500).send({ message: "Error logging in", error: error.message });
//   }
// };
module.exports.loginUser = async (req, res) => {
  try {
    const hashedEmail = hashEmail(req.body.email);
    const user = await User.findOne({ hashedEmail });

    if (!user) {
      return res.status(404).send({ message: "Email does not exist" });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).send({ message: "Incorrect email or password" });
    }

    // ✅ Store user ID in session
    req.session.userId = user._id;

    // ✅ Ensure session is saved before responding
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).send({ message: "Session error" });
      }
      res.status(200).send({
        message: "User logged in successfully",
        access: auth.createAccessToken(user),
      });
    });
    // ✅ Log successful login
    logger.info(`User ${user.email} logged in at ${new Date().toISOString()}`);
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).send({ message: "Error logging in", error: error.message });
  }
};

// **✅ Retrieve User Profile (Decrypting Encrypted Fields)**
module.exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -previousPasswords"
    );
    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid token or user not found" });
    }

    // ✅ Manually decrypt email and mobile before returning response
    const decryptedUser = {
      ...user._doc,
      email: decrypt(user.email),
      mobileNo: decrypt(user.mobileNo),
    };

    res.status(200).json(decryptedUser);
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//[Section] Activity: Retrieve user details
/*
    Steps:
    1. Retrieve the user document using it's id
    2. Change the password to an empty string to hide the password
    3. Return the updated user record
*/
// module.exports.getProfile = (req, res) => {
//   return User.findById(req.user.id)
//     .then((user) => {
//       if (!user) {
//         // if the user has invalid token, send a message 'invalid signature'.
//         return res.status(404).send({ message: "invalid signature" });
//       } else {
//         // if the user is found, return the user.
//         user.password = "";
//         return res.status(200).send(user);
//       }
//     })
//     .catch((error) => errorHandler(error, req, res));
// };

// module.exports.getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select(
//       "-password -previousPasswords"
//     );
//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "Invalid token or user not found" });
//     }

//     // ✅ Manually decrypt email and mobile number before sending response
//     const decryptedUser = {
//       ...user._doc, // Convert Mongoose object to plain JSON
//       email: decrypt(user.email),
//       mobileNo: decrypt(user.mobileNo),
//     };

//     res.status(200).json(decryptedUser);
//   } catch (error) {
//     console.error("Error retrieving profile:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

module.exports.enroll = (req, res) => {
  console.log(req.user.id);
  console.log(req.body.enrolledCourses);

  if (req.user.isAdmin) {
    // if the user is an admin, send a message 'Admin is forbidden'.
    return res.status(403).send({ message: "Admin is forbidden" });
  }

  let newEnrollment = new Enrollment({
    userId: req.user.id,
    enrolledCourses: req.body.enrolledCourses,
    totalPrice: req.body.totalPrice,
  });

  return newEnrollment
    .save()
    .then((enrolled) => {
      // if the user successfully enrolled,return true and send a message 'Enrolled successfully'.
      return res.status(201).send({
        success: true,
        message: "Enrolled successfully",
      });
    })
    .catch((error) => errorHandler(error, req, res));
};

//[SECTION] Activity: Get enrollments
/*
    Steps:
    1. Use the mongoose method "find" to retrieve all enrollments for the logged in user
    2. If no enrollments are found, return a 404 error. Else return a 200 status and the enrollment record
*/

module.exports.getEnrollments = (req, res) => {
  return Enrollment.find({ userId: req.user.id })
    .then((enrollments) => {
      if (enrollments.length > 0) {
        // if there are enrolled courses, return the enrollments.
        return res.status(200).send(enrollments);
      }
      // if there is no enrolled courses, send a message 'No enrolled courses'.
      return res.status(404).send({
        message: "No enrolled courses",
      });
    })
    .catch((error) => errorHandler(error, req, res));
};

//[SECTION] Reset password
// Modify how we export our controllers
// module.exports.resetPassword = async (req, res) => {
//   try {
//     // Add a console.log() to check if you can pass data properly from postman
//     // console.log(req.body);

//     // Add a console.log() to show req.user, our decoded token, does not contain userId property but instead id
//     // console.log(req.user);

//     const { newPassword } = req.body;

//     // update userId to id because our version of req.user does not have userId property but id property instead.
//     const { id } = req.user; // Extracting user ID from the authorization header

//     // Hashing the new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update userId update to id
//     // Updating the user's password in the database
//     await User.findByIdAndUpdate(id, { password: hashedPassword });

//     // Sending a success response
//     res.status(200).json({ message: "Password reset successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

//[SECTION] Update profile
// Update the function to arrow to unify our code formats
// Modify how we export our controllers
module.exports.updateProfile = async (req, res) => {
  try {
    // Add a console.log() to check if you can pass data properly from postman
    // console.log(req.body);

    // Add a console.log() to show req.user, our decoded token, does have id property
    // console.log(req.user);

    // Get the user ID from the authenticated token
    const userId = req.user.id;

    // Retrieve the updated profile information from the request body
    // Update the req.body to use mobileNo instead of mobileNumber to match our schema
    const { firstName, lastName, mobileNo } = req.body;

    // Update the user's profile in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, mobileNo },
      { new: true }
    );

    res.send(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to update profile" });
  }
};
