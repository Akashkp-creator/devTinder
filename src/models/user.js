const mongoose = require("mongoose");
var validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name should be not empty"],
      minlength: [4, "First Name must be at least 4 characters long"],
    },
    lastName: {
      type: String,
      required: [true, "Last name should be not empty"],
    },
    emailId: {
      type: String,
      required: [true, "Email should be not empty"],
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email ID");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: false,
          });
        },
        message:
          "Password must be at least 8 characters long and include 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol.",
      },
    },
    age: {
      type: Number,
      required: true,
      min: [18, "Must be at least 18"],
      max: [60, "Max age is 80"],
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
      //  OR CAN ALSO USE AS BELOW
      //   enum: {
      //     values: ["male", "female", "others"],
      //     message: "{VALUE} is not supported",
      //   },
    },
    skills: {
      type: [String],
      default: ["React", "Node.js", "javascript"],
    },
    about: {
      type: String,
      default: `Hi there I'm the Happiest in the world`,
    },
    photoUrl: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid URL");
        }
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
