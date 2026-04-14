const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: Number,
  category: {
    type: String,
    default: 'Uncategorized'
  },
  available: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.5
  }
});

module.exports = mongoose.model("Menu", menuSchema);