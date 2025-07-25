const express = require("express");
const app = express();

app.use("/", (req, res) => {
  console.log("Namaste from Akash");
  console.log(`${req.url}`);
  res.send("namaste from Akash");
});
app.use("/test1", (req, res) => {
  console.log("Hi this is testing....");
  res.send("nameste this is testing....");
});

app.listen(3000, () => {
  console.log("Server is listening to the port 3000...");
});
