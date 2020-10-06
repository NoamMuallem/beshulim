const { Router } = require("express");
const auth = require("../../middleware/auth");
const Recipe = require("../../models/Recipe");
const router = Router();
const upload = require("../../middleware/image-upload");
const User = require("../../models/User");
require("dotenv").config();

/**
 * @route   GET api/recipes
 * @desc    Get User Recipes
 * @access  Private
 */

router.get("/", auth, async (req, res) => {
  try {
    await req.user
      .populate({ path: "recipes", options: { sort: { date: -1 } } })
      .execPopulate();

    //converting array of recipes to object of recipes - needs to be searchable
    const recipes = {};
    req.user.recipes.forEach((recipe) => {
      //converting array of tags to object of tags - needs to be searchable
      let tags = {};
      recipe._doc.tags.forEach((tag) => (tags[tag] = ""));
      let cpy = { ...recipe._doc, tags };
      recipes[recipe._doc._id] = cpy;
    });
    //converting to array of user tags names - needs to be an array (mainly iterating over it)
    const userTagsNames = Object.keys(req.user.tags);
    const response = {
      recipes: recipes,
      tags: userTagsNames,
    };
    res.send(response);
  } catch (e) {
    res.status(500).send({ msg: e.message });
  }
});

/**
 * @route   POST api/recipes
 * @desc    Create An Recipe
 * @access  Private
 */

router.post("/", auth, upload.any(), async (req, res) => {
  try {
    if (!req.user.confirmed) {
      //error rendered in client
      throw new Error("");
    }
    const data = JSON.parse(req.body.data);
    const recipeTags = Object.keys(data.tags);
    delete data.tags;
    let recipe = new Recipe({
      ...data, //copy over all the fields from req.body to the object
      tags: recipeTags,
      ...(req.body.image ? { image: req.body.image } : {}),
      owner: req.user._id,
    });
    recipe = await recipe.save();
    await Recipe.addTagsToUser(recipe, req.user);
    //the client gets an object of tagName:""
    tags = {};
    recipe.tags.forEach((tag) => {
      tags[tag] = "";
    });
    //to get updated version of userTags
    const user = await User.findById(req.user._id);
    const response = { recipe: { ...recipe._doc, tags }, userTags: user.tags };
    res.status(201).send(response);
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
});

/**
 * @route   DELETE api/recipes/:id
 * @desc    Delete A Recipe
 * @access  Private
 */

router.delete("/:id", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    //await recipe.removeTagsFromUser(req.user);
    await recipe.remove();
    await Recipe.removeTagsFromUser(recipe, req.user);
    //to get updated version of userTags
    const user = await User.findById(req.user._id);
    const response = { userTags: user.tags, _id: req.params.id };
    res.send(response);
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
});

/**
 * @route   Patch api/recipes/:id
 * @desc    Update A Recipe
 * @access  Private
 */
router.patch("/:id", auth, upload.any(), async (req, res) => {
  try {
    let data = JSON.parse(req.body.data);
    data = {
      ...data,
      tags: Object.keys(data.tags),
      ...(req.body.image ? { image: req.body.image } : { image: null }),
    };
    let recipe = await Recipe.findById(req.params.id);
    //check if tags are changed
    let sameTags = true;
    //if the two tags array have the same size
    if (data.tags.length === recipe.tags.length) {
      //iterate over all the elements of one of the arrays
      for (let i = 0; i < data.tags.length && sameTags; i++) {
        //if the element i in the other array
        if (!recipe.tags.includes(data.tags[i])) {
          sameTags = false;
        }
      }
    } else {
      sameTags = false;
    }
    //if tags have changeg
    if (!sameTags) {
      await Recipe.removeTagsFromUser(recipe, req.user);
    }
    Object.keys(data).forEach((update) => (recipe[update] = data[update]));
    if (!sameTags) {
      await Recipe.addTagsToUser(recipe, req.user);
    }
    recipe = await recipe.save();
    tags = {};
    recipe.tags.forEach((tag) => {
      tags[tag] = "";
    });
    //to get updated version of userTags
    const user = await User.findById(req.user._id);
    const response = { recipe: { ...recipe._doc, tags }, userTags: user.tags };
    res.status(201).send(response);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
