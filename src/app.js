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
