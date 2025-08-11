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

const validateEditProfileData = (req) => {
  const allowEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "skills",
    "about",
    "photoUrl",
  ];
  const allowToEdit = Object.keys(req.body).every((key) =>
    allowEditFields.includes(key)
  );
  return allowToEdit;
};

// to validate forgot password
function validateForgotPassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  if (password.length < minLength) {
    return {
      valid: false,
      message: "Password must be at least 8 characters long.",
    };
  }
  if (!hasUpperCase) {
    return {
      valid: false,
      message: "Password must include at least one uppercase letter.",
    };
  }
  if (!hasLowerCase) {
    return {
      valid: false,
      message: "Password must include at least one lowercase letter.",
    };
  }
  if (!hasNumber) {
    return {
      valid: false,
      message: "Password must include at least one number.",
    };
  }
  if (!hasSpecialChar) {
    return {
      valid: false,
      message: "Password must include at least one special character.",
    };
  }

  return { valid: true };
}

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateForgotPassword,
};
