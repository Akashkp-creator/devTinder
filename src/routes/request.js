const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  res.status(200).send(`${user.firstName}  sent you a connection request`);
});

module.exports = { requestRouter };
