const mongoose = require("mongoose");

// Create Schema
const TagsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    required: false,
    default: 1,
  },
});

const Tag = mongoose.model("Tag", TagsSchema);

module.exports = Tag;
