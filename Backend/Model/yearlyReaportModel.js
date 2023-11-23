const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const yearlyReportSchema = new Schema({
    year: {
        type: String,
        required: true
    },
    TotalExpense: {
        type: Schema.Types.Decimal128,
        required: true,
        default: 0
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
})

module.exports = mongoose.model('YearlyReport', yearlyReportSchema);