const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name should be not empty"],
      minlength: [4, "First Name must be at least 4 characters long"],
      index: true,
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
      default: 25,
      min: [18, "Must be at least 18"],
      max: [80, "Max age is 80"],
    },
    gender: {
      type: String,
      default: "male",
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

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$12345", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordFromUserInput) {
  const user = this;
  const hashedPassword = user.password;
  const validatePassword = await bcrypt.compare(
    passwordFromUserInput,
    hashedPassword
  );
  return validatePassword;
};
const User = mongoose.model("User", userSchema);

module.exports = { User };
