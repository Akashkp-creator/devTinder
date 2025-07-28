const adminAuth = (req, res, next) => {
  console.log("Admin auth is getting Checked!!!");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(404).send("unauthorized request");
  }
  next();
};
const userAuth = (req, res, next) => {
  console.log("user auth is getting Checked!!!");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(404).send("unauthorized request");
  }
  next();
};

module.exports = { adminAuth, userAuth };
