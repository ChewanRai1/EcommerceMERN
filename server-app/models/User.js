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

const PASSWORD_EXPIRY_DAYS = 90;
const PREVIOUS_PASSWORD_LIMIT = 3;
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
