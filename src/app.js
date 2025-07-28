const express = require("express");
const app = express();

app.get("/admin/getAllData", (req, res) => {
  console.log("Admin Data ");
  throw new Error("i am an error");
  // res.send("This is admin Data");
});
// here the order is very important and always write the below wild card at the end...so that it will handle the error
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
  }
});
app.listen(3000, () => {
  console.log("Server is listening to the port 3000...");
});
