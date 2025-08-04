const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
// const { getJWT, validatePassword } = require("./models/user");

//to use req.body,applicable for all the routes, to re4d/convert/parse json(coming from the browser) to js object to read here
app.use(express.json());
// to read/parse the cookie coming from the browser.
app.use(cookieParser());

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
    const validatePassword = await user.validatePassword(password);

    if (validatePassword) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 7 * 3600000), // cookie will be removed after 7 days
      });

      res.send("user logged in Successfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});
app.post("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  res.status(200).send(`${user.firstName}  sent you a connection request`);
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
