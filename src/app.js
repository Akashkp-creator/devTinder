const express = require("express");
const app = express();
// NOTE: if u make use of  "use" if will be applicable for all the http methods,like GET,POST etc.
// type-1

// app.use("/user", (req, res, next) => {
//   console.log("Namaste from Akash1");
//   // res.send("Mulitiple route handler 1");
//   next();
// });

// app.use("/user", (req, res, next) => {
//   console.log("Namaste from Akash2");
//   res.send("Mulitiple route handler 2");
// });

// type 2

app.use(
  "/user",
  (req, res, next) => {
    console.log("Namaste from Akash1");
    next();
  },
  // note v can also place it in the array it will work same as without array
  [
    (req, res, next) => {
      console.log("Namaste from Akash2");
      next();
    },
    (req, res, next) => {
      console.log("Namaste from Akash3");
      next();
    },
  ],
  (req, res, next) => {
    console.log("Namaste from Akash4");
    res.send("Mulitiple route handler 4");
  }
);

app.listen(3000, () => {
  console.log("Server is listening to the port 3000...");
});
