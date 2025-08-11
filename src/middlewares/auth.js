const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("token not found");
    } else {
      const decodedData = await jwt.verify(token, "DEV@Tinder$12345");
      const user = await User.findById({ _id: decodedData._id });
      if (!user) {
        throw new Error("user not found");
      }
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

module.exports = { userAuth };
