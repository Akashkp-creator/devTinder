const validateSignUpData = (req) => {
  console.log(req.body);
  const { firstName, lastName, emailId, password } = req.body;

  // ✅ First Name validation
  if (!firstName || typeof firstName !== "string") {
    return "First name is required and must be a string";
  }

  if (firstName.length < 2 || firstName.length > 30) {
    return "First name must be between 2 and 30 characters";
  }

  // ✅ Last Name validation
  if (!lastName || typeof lastName !== "string") {
    return "Last name is required and must be a string";
  }

  if (lastName.length < 2 || lastName.length > 30) {
    return "Last name must be between 2 and 30 characters";
  }

  // ✅ Password validation
  if (!password || typeof password !== "string") {
    return "Password is required and must be a string";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  const strongPasswordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
  if (!strongPasswordPattern.test(password)) {
    return (
      "Password must include at least:\n" +
      "- 1 uppercase letter\n" +
      "- 1 number\n" +
      "- 1 special character (!@#$%^&*)"
    );
  }

  // ✅ Email  validation

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailId || typeof emailId !== "string") {
    return "Email is required and must be a string";
  }

  if (!emailRegex.test(emailId)) {
    return "Invalid email format";
  }
};

module.exports = { validateSignUpData };
