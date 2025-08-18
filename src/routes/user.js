const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");
const { User } = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName skills gender about photoUrl age";

// to get all the pending connection request
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // console.log(loggedInUser);
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    //   You can also write as below
    // .populate("fromUserId",firstName lastName skills gender");
    // console.log(connectionRequest);
    if (!connectionRequest || connectionRequest.length === 0) {
      return res.status(404).send("No connection request found");
    }
    return res.status(200).json({
      message: "Data fetched Successfully",
      data: connectionRequest,
    });
  } catch (error) {
    return res.status(400).send("Error :" + error.message);
  }
});

// to get accepted connection request
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    // console.log(connectionRequest);
    const data = connectionRequest.map((curr) => {
      if (curr.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return curr.toUserId;
      }
      return curr.fromUserId;
    });
    return res.status(200).json({ data });
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
});

// to get the feed
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    // console.log(connectionRequest);
    // console.log("****************");

    const hideUserFromFeed = new Set();
    connectionRequest.forEach((connReq) => {
      hideUserFromFeed.add(connReq.fromUserId.toString());
      hideUserFromFeed.add(connReq.toUserId.toString());
    });
    // console.log(hideUserFromFeed);

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (error) {
    return res.status(400).send("Error " + error.message);
  }
});
module.exports = { userRouter };
