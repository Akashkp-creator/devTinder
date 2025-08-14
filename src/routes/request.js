const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");
const { default: mongoose } = require("mongoose");
const { User } = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const toUserId = req.params.toUserId;
      const fromUserId = req.user._id;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: `Invalid Status Type: ${status}` });
      }

      // ✅ Validate ObjectId format first
      if (
        !mongoose.Types.ObjectId.isValid(toUserId) ||
        toUserId.length !== 24
      ) {
        return res.status(400).json({ error: "Invalid user ID format" });
      }

      // ✅ Check if user exists
      const findToUser = await User.findById(toUserId);
      if (!findToUser) {
        return res.status(404).json({ error: `User  not found` });
      }

      // ✅ Now check for existing connection request
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
          { fromUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send(
            "Connection Request may exist already or Invalid Connection Request"
          );
      }
      const connectionRequest = new ConnectionRequestModel({
        toUserId,
        fromUserId,
        status,
      });
      const connectionRequestData = await connectionRequest.save();

      res.json({
        message: `${req.user.firstName} ${status} you`,
        connectionRequestData,
      });
    } catch (error) {
      res.status(400).send(`Error: ${error.message}`);
    }
  }
);

module.exports = { requestRouter };
