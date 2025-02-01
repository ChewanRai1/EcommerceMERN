const jwt = require("jsonwebtoken");

// [SECTION] Environment Setup
require("dotenv").config();

// [Section] JSON Web Tokens

//[Section] Token Creation
module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
};

// [MODIFIED] Token Verification with Expiry Handling
module.exports.verify = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({ auth: "Failed. No Token" });
  }

  token = token.slice(7, token.length);

  jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decodedToken) {
    if (err) {
      return res.status(403).send({
        auth: "Failed",
        message: "Session Expired. Please login again.",
      });
    } else {
      req.user = decodedToken;
      next();
    }
  });
};

// ✅ [MODIFIED] Secure Logout (Clears Token)
// module.exports.logoutUser = (req, res) => {
//   res.clearCookie("token"); // ✅ Remove JWT on logout
//   req.session.destroy(() => {
//     res.status(200).send({ message: "Logged out successfully" });
//   });
// };

// module.exports.logoutUser = (req, res) => {
//   if (!req.session) {
//     return res.status(400).json({ message: "No active session found." });
//   }

//   req.session.destroy((err) => {
//     if (err) {
//       console.error("❌ Error destroying session:", err);
//       return res.status(500).json({ message: "Logout failed." });
//     }

//     // ✅ Ensure session is removed from MongoDB
//     res.clearCookie("connect.sid", {
//       path: "/",
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//     });

//     console.log("✅ User logged out, session destroyed.");
//     res.status(200).json({ message: "Logged out successfully." });
//   });
// };

module.exports.logoutUser = (req, res) => {
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
};


//[SECTION] Verify Admin
module.exports.verifyAdmin = (req, res, next) => {
  // console.log("result from verifyAdmin method");
  // console.log(req.user);
  if (req.user.isAdmin) {
    next();
  } else {
    return res.status(403).send({
      auth: "Failed",
      message: "Action Forbidden",
    });
  }
};

// [SECTION] Error Handler
module.exports.errorHandler = (err, req, res, next) => {
  // Log the error
  console.error(err);

  //Add status code 500
  const statusCode = err.status || 500;
  const errorMessage = err.message || "Internal Server Error";

  // Send a standardized error response
  res.status(statusCode).json({
    error: {
      message: errorMessage,
      errorCode: err.code || "SERVER_ERROR",
      details: err.details || null,
    },
  });
};

//[SECTION] Middleware to check if the user is authenticated
module.exports.isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id } = req.user;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
