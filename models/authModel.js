const mongoose = require("mongoose");

// Create a new schema for the auth model
// This schema defines the structure of the data that will be stored in the database
const authSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  state: {
    type: String,
    default: "",
  },
}, { timestamps: true });


// Create a model based on the schema
const Auth = mongoose.model("Auth", authSchema);

// Export the model so it can be used in other parts of the application
module.exports = Auth