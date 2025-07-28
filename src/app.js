const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");

// Since v used "use" it will be applicable for all the http methods(ie.get,post,delete etc.)
// the below route is handled when v use "/admin", "/admin/user", "/admin/anything", "/admin/:userId"
app.use("/admin", adminAuth);

app.get("/admin/data", (req, res) => {
  console.log("Admin Data ");
  res.send("This is admin Data");
});
app.get("/user/getAllData", userAuth, (req, res) => {
  console.log("User DATA GETTING");
  res.send("This is User DATA");
});

app.post("/user/login", (req, res) => {
  res.send("User lOgged in successfully");
});

app.delete("/admin/remove", (req, res) => {
  console.log("Admin Removed ");
  res.send("Admin data is removed");
});

app.listen(3000, () => {
  console.log("Server is listening to the port 3000...");
});
