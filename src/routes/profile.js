const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");

const {
  validateEditProfileData,
  validateForgotPassword,
} = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      return res.status(400).json({ error: "Invalid field update" });
    }
    const loggedInUser = req.user;
    console.log(loggedInUser);
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    console.log(loggedInUser);
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, Your Profile update is successful`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const allowEditField = ["password"];
    const allowToEdit = Object.keys(req.body).every((key) =>
      allowEditField.includes(key)
    );
    if (!allowToEdit) {
      return res.status(400).json({ message: `invalid field update` });
    }

    const { password } = req.body;
    const validation = validateForgotPassword(password);

    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    // logic to update the PW
    const loggedInUser = req.user;
    // console.log(loggedInUser);
    const newPassword = password;
    // console.log(newPassword);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // console.log(hashedPassword);
    loggedInUser.password = hashedPassword;

    // console.log(loggedInUser);
    await loggedInUser.save();
    res.json({ message: "Password reset successful." });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});
module.exports = { profileRouter };
