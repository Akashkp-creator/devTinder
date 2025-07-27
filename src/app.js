const express = require("express");
const app = express();

// app.use("/hello2", (req, res) => {
//   res.send("Hyyy this is hello2 testing");
// });

// app.use("/", (req, res) => {
//   console.log("Namaste from Akash");
//   console.log(`${req.url}`);
//   res.send("namaste from Akash");
// });
app.post("/test1", (req, res) => {
  res.send("Hi this is test1... for post.");
});
app.get("/test1", (req, res) => {
  res.send("hyyy this is get test1");
});

app.put("/test1", (req, res) => {
  res.send("hyyy this is put test1");
});

app.delete("/test1", (req, res) => {
  res.send("Hyyy this test1 from delete");
});
app.listen(3000, () => {
  console.log("Server is listening to the port 3000...");
});
