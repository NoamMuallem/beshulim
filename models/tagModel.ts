import mongoose from "mongoose";

// Create Schema
const TagsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: false,
    default: 1,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User", // needs to be identical to the name we gave in the user model file when we defined mongoose.model('User',userSchema)
  },
});

const Tag = mongoose.model("Tag", TagsSchema);

export default Tag;
