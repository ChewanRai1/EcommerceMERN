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

//2nd

// const mongoose = require("mongoose");

// const bcrypt = require("bcrypt");
// const { encrypt, decrypt, hashEmail } = require("../utils/security");

// const PASSWORD_EXPIRY_DAYS = 90;
// const PREVIOUS_PASSWORD_LIMIT = 3;

// const algorithm = "aes-256-cbc";

// const secretKey = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

// // Debugging: Print key length
// console.log("ENCRYPTION_KEY Length:", secretKey.length, "bytes");
// console.log("ENCRYPTION_KEY Value:", secretKey.toString("hex"));

// if (!secretKey || secretKey.length !== 32) {
//   throw new Error("Missing or invalid ENCRYPTION_KEY! Must be 32 bytes.");
// }

// // Define password complexity requirements using regex
// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

// const userSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: [true, "First Name is Required"],
//   },
//   lastName: {
//     type: String,
//     required: [true, "Last Name is Required"],
//   },
//   hashedEmail: { type: String, required: true, unique: true }, // Store hashed email for uniqueness check
//   email: {
//     type: String,
//     required: [true, "Email is Required"],
//     unique: true,
//     // match: [/^\S+@\S+\.\S+$/, "Invalid email format"], //rmeoving validation from schema for encrytion email and phone
//     set: encrypt, // Encrypt email before saving
//     get: decrypt, // Decrypt email when retrieving
//   },
//   password: {
//     type: String,
//     required: [true, "Password is Required"],
//     minlength: [8, "Password must be at least 8 characters long"],
//     validate: {
//       validator: function (value) {
//         return passwordRegex.test(value);
//       },
//       message:
//         "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.",
//     },
//   },
//   isAdmin: {
//     type: Boolean,
//     default: false,
//   },
//   mobileNo: {
//     type: String,
//     required: [true, "Mobile Number is Required"],
//     set: encrypt, // Encrypt mobile number
//     get: decrypt, // Decrypt when retrieving
//     // validate: {              //remove validation for encrytion
//     //   validator: function (value) {
//     //     return /^[0-9]{10}$/.test(value);
//     //   },
//     //   message: "Mobile number must be exactly 10 digits.",
//     // },
//   },
// });

// // Method to check password reuse
// userSchema.methods.isPasswordReused = function (newPassword) {
//   return this.previousPasswords.some((pwd) =>
//     bcrypt.compareSync(newPassword, pwd)
//   );
// };

// // Method to check password expiry
// userSchema.methods.isPasswordExpired = function () {
//   const expiryDate = new Date(this.passwordChangedAt);
//   expiryDate.setDate(expiryDate.getDate() + PASSWORD_EXPIRY_DAYS);
//   return new Date() > expiryDate;
// };

// // 🔽 Test Encryption and Decryption (Temporary Debugging)
// console.log("🔒 Encrypted Email:", encrypt("test@example.com"));
// console.log("📩 Decrypted Email:", decrypt(encrypt("test@example.com")));

// module.exports = mongoose.model("User", userSchema);

//3rd
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { encrypt, decrypt, hashEmail } = require("../utils/security");

const PASSWORD_EXPIRY_DAYS = 90;
const PREVIOUS_PASSWORD_LIMIT = 3;

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, "First Name is Required"] },
  lastName: { type: String, required: [true, "Last Name is Required"] },
  hashedEmail: { type: String, required: true, unique: true }, // Store hashed email for uniqueness check
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
    set: encrypt, // Encrypt before storing
    get: decrypt, // Decrypt when retrieving
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
    minlength: [8, "Password must be at least 8 characters long"],
  },
  isAdmin: { type: Boolean, default: false },
  mobileNo: {
    type: String,
    required: [true, "Mobile Number is Required"],
    set: encrypt,
    get: decrypt,
  },
  passwordChangedAt: { type: Date, default: Date.now },
  previousPasswords: { type: [String], default: [] },
});

// ✅ **Check Password Reuse**
userSchema.methods.isPasswordReused = function (newPassword) {
  return this.previousPasswords.some((pwd) =>
    bcrypt.compareSync(newPassword, pwd)
  );
};

// ✅ **Check Password Expiry**
userSchema.methods.isPasswordExpired = function () {
  const expiryDate = new Date(this.passwordChangedAt);
  expiryDate.setDate(expiryDate.getDate() + PASSWORD_EXPIRY_DAYS);
  return new Date() > expiryDate;
};

module.exports = mongoose.model("User", userSchema);
