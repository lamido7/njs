const jwt = require("jsonwebtoken");
const Auth = require("../models/authModel");

const validateRegister = (req, res, next) => {
  const { email, password, firstName, lastName, state } = req.body;

  const errors = [];

  if (!email) {
    errors.push("email is required");
  }
  if (!password) {
    errors.push("password is required");
  }
  if (errors.length > 0) {
    return res.status(400).json({
      message: "validation error",
      errors,
    });
  }

  next();
};

const authorization = async (req, res, next) => {
  const token = req.header("authorization");

  if (!token) {
    return res.status(401).json({
      message: "Please login",
    });
  }

  const splitToken = token.split(" ");

  const realToken = splitToken[1];

  const decoded = jwt.verify(realToken, `${process.env.ACCESS_TOKEN}`);

  if (!decoded) {
    return res.status(401).json({
      message: "Please login",
    });
  }

  const user = await Auth.findById(decoded.id);

  if (!user) {
    return res.status(401).json({
      message: "user account does not exist",
    });
  }

  req.user = user;

  next();
  console.log(user);
};

module.exports = {
  validateRegister,
  authorization,
};
