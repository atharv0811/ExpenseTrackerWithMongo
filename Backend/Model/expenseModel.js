const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  expenseAmount: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  expenseType: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

module.exports = mongoose.model("Expense", expenseSchema);
