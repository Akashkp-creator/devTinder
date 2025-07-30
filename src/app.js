const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const { User } = require("./models/user");

app.use(express.json()); //to use req.body,applicable for all the routes

app.post("/signup", async (req, res) => {
  // Creating a new instance of the User model
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User Added Successfully ");
  } catch (error) {
    res.status(400).send("Error in saving the user:" + error.message);
  }
});

// API to GET user by email
app.get("/user", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ firstName: req.body.firstName });
    // const user = await User.findOne({ emailId: req.body.emailId });

    if (!user) {
      return res.status(404).send("NO user found");
    }
    res.status(200).send(user);
  } catch (error) {
    console.log("something went wrong in finding the user");
    res
      .status(500)
      .send("something went wrong in finding the user " + error.message);
  }
});
// API to Feed API -GET   /feed -get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(404).send("no users found");
    }
    res.status(200).send(users);
  } catch (error) {
    res
      .status(500)
      .send("something went wrong in finding the users " + error.message);
  }
});

// API - GET to findById
app.get("/getByUserId", async (req, res) => {
  console.log(req.body);
  try {
    const dataById = await User.findById({ _id: req.body._id });
    if (!dataById) {
      return res.status(404).send("invalid User Id");
    }
    res.status(200).send(dataById);
  } catch (error) {
    res
      .status(500)
      .send("something went wrong in finding the user " + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Established connection successfully with DATABASE.....");
    app.listen(3000, () => {
      console.log("Server is listening to the port 3000...");
    });
  })
  .catch((err) => {
    console.log("Not connected with the DATABASE");
  });
