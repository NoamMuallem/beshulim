const mongoose = require("mongoose");

// Create Schema
const RecipeSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User", // needs to be identical to the name we gave in the user model file when we defined mongoose.model('User',userSchema)
  },
});

RecipeSchema.statics.addTagsToUser = async (recipe, user) => {
  try {
    //copy the user tags to manipulate later
    const userTags = { ...user.tags };
    //for each tag if in user tags - increment amount if not - initialize
    recipe.tags.forEach((tag) => {
      if (userTags[tag]) {
        userTags[tag].amount++;
      } else {
        userTags[tag] = { tagName: tag, amount: 1 };
      }
    });
    user.markModified("tags");
    user.tags = userTags;
    await user.save();
  } catch (e) {
    throw new Error("עדכון תגיות נכשל, שגיאת שרת: " + e.message);
  }
};

RecipeSchema.statics.removeTagsFromUser = async (recipe, user) => {
  try {
    //copy the user tags to manipulate later
    const userTags = { ...user.tags };
    //for each tag check what the amount in user
    //if 1 delete tag completely if not decrement by one
    recipe.tags.forEach((tag) => {
      userTags[tag].amount == 1 ? delete userTags[tag] : userTags[tag].amount--;
    });
    user.markModified("tags");
    user.tags = userTags;
    await user.save();
  } catch (e) {
    throw new Error("עדכון תגיות נכשל, שגיאת שרת: " + e.message);
  }
};

const Recipe = mongoose.model("Recipe", RecipeSchema);

module.exports = Recipe;
