const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Title is required"],
    },
    lastName: {
      type: String,
      required: [true, "Content is required"],
    },
    email: {
      type: String,
      required: [true, "Title is required"],
    },
    phone: {
      type: String,
      required: [true, "Content is required"],
    },
    date: {
      type: Date,
    },
    schedule: {
      type: String,
      required: [true, "Content is required"],
    },
    index: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
