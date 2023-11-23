const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const UrlSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    requried: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

module.exports = mongoose.model("UrlData", UrlSchema);
