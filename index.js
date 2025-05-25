const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Auth = require("./models/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendForgotPasswordEmail } = require("./sendMail");
const { handleGetAllUsers, handleUserRegistration } = require("./Controllers");
const { validateRegister, authorization } = require("./middlewares");
dotenv.config();

const app = express();

//middleware body parser
app.use(express.json());

const PORT = process.env.PORT || 8000;

//connect to mongodb from env
mongoose.connect(process.env.MONGO_DB_URL).then(() => {
  console.log("MongoDB connected");

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// validateregister middleware checks if the user has provided the required fields
app.post("/sign-up", validateRegister, handleUserRegistration);

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //check if user exists
  const user = await Auth.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User account does not exist" });
  }

  //check if password is correct
  const isMatch = await bcrypt.compare(password, user?.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  //generate a token
  const accessToken = jwt.sign({ id: user?._id }, process.env.ACCESS_TOKEN, {
    expiresIn: "5h",
  });

  const refreshToken = jwt.sign({ id: user?._id }, process.env.REFRESH_TOKEN, {
    expiresIn: "30m",
  });

  res.status(200).json({
    message: "login successful",
    accessToken,
    refreshToken,
    user: {
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      state: user?.state,
    },
  });
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await Auth.findOne({ email });

  //validate user
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  //send the user an email with token

  const accessToken = jwt.sign({ user }, `${process.env.ACCESS_TOKEN}`, {
    expiresIn: "5m",
  });

  await sendForgotPasswordEmail(email, accessToken);

  //send  otp
  res.status(200).json({ message: "Please check your email" });
});

app.patch("/reset-password", async (req, res) => {
  const { email, password } = req.body;

  const user = await Auth.findOne({ email });
  //validate user
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  user.password = hashedPassword;
  await user.save();
  res.status(200).json({ message: "Password reset successfully" });
});

//mcv r
// model controller routes

//middlewares / authorization / validation


//deploy

app.get("/all-users", authorization ,handleGetAllUsers)