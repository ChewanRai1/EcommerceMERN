// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({

//     firstName: {
//         type: String,
//         required: [true, 'First Name is Required']
//     },
//     lastName: {
//         type: String,
//         required: [true, 'Last Name is Required']
//     },
//     email: {
//         type: String,
//         required: [true, 'Email is Required']
//     },
//     password: {
//         type: String,
//         required: [true, 'Password is Required']
//     },
//     isAdmin: {
//         type: Boolean,
//         default: false
//     },
//     mobileNo: {
//         type: String,
//         required: [true, 'Mobile Number is Required']
//     }
// });

// module.exports = mongoose.model('User', userSchema);

const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const crypto = require("crypto");

const PASSWORD_EXPIRY_DAYS = 90;
const PREVIOUS_PASSWORD_LIMIT = 3;

const algorithm = "aes-256-cbc";
const secretKey = process.env.ENCRYPTION_KEY;

if (!secretKey || secretKey.length !== 32) {
  throw new Error("Missing or invalid ENCRYPTION_KEY! Must be 32 bytes.");
}
// Encrypt Function (For Email & Mobile)
const encrypt = (text) => {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    return "[ENCRYPTION ERROR]";
  }
};

const decrypt = (text) => {
  try {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(secretKey),
      iv
    );
    let decrypted = decipher.update(encryptedText, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    return "[DECRYPTION FAILED]";
  }
};

// Define password complexity requirements using regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is Required"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is Required"],
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    set: encrypt, // Encrypt email before saving
    // get: decrypt, // Decrypt email when retrieving
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
    minlength: [8, "Password must be at least 8 characters long"],
    validate: {
      validator: function (value) {
        return passwordRegex.test(value);
      },
      message:
        "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.",
    },
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  mobileNo: {
    type: String,
    required: [true, "Mobile Number is Required"],
    set: encrypt, // Encrypt mobile number
    // get: decrypt, // Decrypt when retrieving
    validate: {
      validator: function (value) {
        return /^[0-9]{10}$/.test(value);
      },
      message: "Mobile number must be exactly 10 digits.",
    },
  },
});

// Method to check password reuse
userSchema.methods.isPasswordReused = function (newPassword) {
  return this.previousPasswords.some((pwd) =>
    bcrypt.compareSync(newPassword, pwd)
  );
};

// Method to check password expiry
userSchema.methods.isPasswordExpired = function () {
  const expiryDate = new Date(this.passwordChangedAt);
  expiryDate.setDate(expiryDate.getDate() + PASSWORD_EXPIRY_DAYS);
  return new Date() > expiryDate;
};

module.exports = mongoose.model("User", userSchema);
