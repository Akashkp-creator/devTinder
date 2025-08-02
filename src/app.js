const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json()); //to use req.body,applicable for all the routes

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    // const validatePassword = await bcrypt.compare(
    //   password,
    //   "$2b$10$pJiiBnmBFOfsL0/sYF3/5OaQ6UJZyTf9/D7/9kK1Mt1xCFtHHlRYS"
    // );
    const validatePassword = await bcrypt.compare(password, user.password);
    console.log(validatePassword);

    if (validatePassword) {
      res.send("user logged in Successfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// API to GET user by email
app.get("/user", async (req, res) => {
  // console.log(req.body);
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
// API to delete an user
app.delete("/user", async (req, res) => {
  // const userId = req.body.userId;
  try {
    // can also use Model.findByIdAndDelete() only for id
    // const deletedUser = await User.findOneAndDelete({ _id: userId });
    // short hand for { _id: userId } can also be used as userId
    // const deletedUser = await User.findOneAndDelete(userId);
    // const deletedUser = await User.findOneAndDelete(req.body.lastName);
    // the short hand is in above line
    const deletedUser = await User.findOneAndDelete({
      lastName: req.body.lastName,
    });
    res.send(`${deletedUser} is deleted`);
  } catch (error) {
    res
      .status(500)
      .send("something went wrong in deleting the user " + error.message);
  }
});

// API - to Update a user by id
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  console.log(` the user id is ${userId}`);
  const newValue = req.body;
  console.log(newValue);

  try {
    const ALLOWED_UPDATE_FIELDS = [
      "skills",
      "about",
      "photoUrl",
      "age",
      "gender",
    ];

    const isAllowedFields = Object.keys(newValue).every((keys) =>
      ALLOWED_UPDATE_FIELDS.includes(keys)
    );

    if (!isAllowedFields) {
      return res.send(
        "Update not allowed because of mismatch field or non-editable field"
      );
    }
    if (Array.isArray(newValue?.skills) && newValue.skills.length > 10) {
      return res.status(400).send("Only 10 skills allowed");
    }
    const updatedValue = await User.findByIdAndUpdate(
      { _id: userId },
      newValue,
      { returnDocument: "after", runValidators: true }
    );
    console.log(updatedValue);
    res.send("user updated successfully");
  } catch (error) {
    res
      .status(500)
      .send("something went wrong in updating the user " + error.message);
  }
});

// api- update user by emailId
app.patch("/userUpdateByEmail", async (req, res) => {
  const newValue = req.body;
  console.log(newValue);
  try {
    const updatedValue = await User.findOneAndUpdate(
      {
        emailId: req.body.emailId,
      },
      newValue,
      { returnDocument: "after" }
    );
    console.log(updatedValue);
    res.send("user updated successfully using emailId");
  } catch (error) {
    res
      .status(500)
      .send("something went wrong in updating the user " + error.message);
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
