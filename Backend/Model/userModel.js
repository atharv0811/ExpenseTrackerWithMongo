const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPremium: {
    type: Boolean,
    required: true,
    default: false,
  },
  totalExpense: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Users", userSchema);
