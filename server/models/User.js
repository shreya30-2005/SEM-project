const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "user"
  },
  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu'
  }]
});

module.exports = mongoose.model("User", userSchema);
