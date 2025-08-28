const express = require("express");
const authRouter = express.Router();
const { User } = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  // validate the inputs(ie. firstName, lastName, emailId, password) using helper function
  const error = validateSignUpData(req);
  if (error) {
    return res.status(400).send(error);
  }

  // Encrypt(hash) the password before saving to DB using bcrypt library.
  const hashedPassword = await bcrypt.hash(password, 10);
  // console.log(hashedPassword);

  // Creating a new instance of the User model
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: hashedPassword,
  });
  try {
    await user.save();
    res.send("User Added Successfully ");
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    // console.log(req.body);
    // console.log("Email:", req.body.emailId, "Password:", req.body.password);

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    // const validatePassword = await bcrypt.compare(
    //   password,
    //   "$2b$10$pJiiBnmBFOfsL0/sYF3/5OaQ6UJZyTf9/D7/9kK1Mt1xCFtHHlRYS"
    // );
    const validatePassword = await user.validatePassword(password);

    if (validatePassword) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 7 * 3600000), // cookie will be removed after 7 days
      });

      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logged out successful");
});

module.exports = { authRouter };
