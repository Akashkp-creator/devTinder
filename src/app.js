const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const { User } = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Janvi",
    lastName: "K M",
    emailId: "janvi@janvi.com",
    password: "123@123",
    gender: "female",
  });
  try {
    await user.save();
    res.send("User Added Successfully ");
  } catch (error) {
    res.status(400).send("Error in saving the user:" + error.message);
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
