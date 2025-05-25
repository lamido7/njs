const bcrypt = require("bcrypt");

const Auth = require("../models/authModel");

const handleGetAllUsers = async (req, res) => {
  const allUser = await Auth.find();

  res.status(200).json({
    message: "All users",
    allUser,
  });
};

const handleUserRegistration =  async (req, res) => {
  try {
    const { email, password, firstName, lastName, state } = req.body;
    //check if the email and password are provided
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    //check if the user already exists
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //check if the password is at least 6 characters
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newuser = new Auth({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      state,
    });

    await newuser.save();
    res.status(201).json({
      message: "User created successfully",
      newuser: { email, firstName, lastName, state },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = {
  handleGetAllUsers,
  handleUserRegistration,
};
