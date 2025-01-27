const express = require("express");
const svgCaptcha = require("svg-captcha");

const router = express.Router();

// Generate a new CAPTCHA
router.get("/captcha", (req, res) => {
  const captcha = svgCaptcha.create({
    size: 6,
    noise: 3,
    color: true,
    ignoreChars: "0o1i",
  });

  req.session.captcha = captcha.text;
  res.type("svg");
  res.status(200).send(captcha.data);
});

// Validate the CAPTCHA
router.post("/verify-captcha", (req, res) => {
  const { captcha } = req.body;
  if (req.session.captcha && req.session.captcha === captcha) {
    res.json({ success: true, message: "CAPTCHA matched!" });
  } else {
    res.json({ success: false, message: "CAPTCHA verification failed!" });
  }
});

module.exports = router;
