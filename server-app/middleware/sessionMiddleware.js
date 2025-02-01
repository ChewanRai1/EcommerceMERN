// module.exports = (req, res, next) => {
//     if (!req.session || !req.session.userId) {
//       res.clearCookie("connect.sid", { path: "/" });
//       return res.status(401).json({ message: "Session expired. Please log in again." });
//     }

//     const now = Date.now();
//     if (req.session.lastActivity && now - req.session.lastActivity > 1000 * 60 * 2) { // 2 min timeout
//       console.log("🔴 Session expired due to inactivity, logging out user...");

//       req.session.destroy((err) => {
//         if (err) console.error("Session destruction error:", err);
//       });

//       res.clearCookie("connect.sid", { path: "/" });
//       return res.status(401).json({ message: "Session expired. Please log in again." });
//     }

//     req.session.lastActivity = now;
//     next();
//   };
module.exports = (req, res, next) => {
  if (req.path === "/users/logout") {
    return next(); // ✅ Skip session checks for logout route
  }

  if (!req.session || !req.session.userId) {
    res.clearCookie("connect.sid", { path: "/" });
    return res
      .status(401)
      .json({ message: "Session expired. Please log in again." });
  }

  const now = Date.now();
  if (
    req.session.lastActivity &&
    now - req.session.lastActivity > 1000 * 60 * 60
  ) {
    // 2 min timeout
    console.log("🔴 Session expired, logging out user...");

    req.session.destroy((err) => {
      if (err) console.error("Session destruction error:", err);
    });

    res.clearCookie("connect.sid", { path: "/" });
    return res
      .status(401)
      .json({ message: "Session expired. Please log in again." });
  }

  req.session.lastActivity = now;
  next();
};
