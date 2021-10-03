const mongoose = require("mongoose");

// Create Schema
const RecipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    directions: { type: String },
    tags: {
      type: [String],
    },
    image: {
      type: String, //binaries for image
      default: undefined,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User", // needs to be identical to the name we gave in the user model file when we defined mongoose.model('User',userSchema)
    },
  },
  {
    timestamps: true,
  }
);

//to allow text base search
RecipeSchema.index({ name: "text" });

const Recipe = mongoose.model("Recipe", RecipeSchema);

module.exports = Recipe;
