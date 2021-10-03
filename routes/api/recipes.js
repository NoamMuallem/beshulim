const { Router } = require("express");
const auth = require("../../middleware/auth");
const Recipe = require("../../models/Recipe");
const router = Router();
const upload = require("../../middleware/image-upload");
const User = require("../../models/User");
const Tag = require("../../models/Tag");
require("dotenv").config();

/**
 * @route   GET api/recipes
 * @desc    Get User Recipes
 * @access  Private
 */

//Get /tasks?completed=true
//Get /tasks?limit=10&skip=3(page 3, 10 resolts=> show 20-29)
//Get /tasks?sortBy=createdAt:asc/desc
router.get("/", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.text) {
    //  //we get a string from req.query.completed, if the string equals to the string 'true'
    //  //we will save that value and use that
    //  //if nothing was provided we will get null and not populate match, so we will get all the tasks we have
    match.$text = { $search: req.query.text };
  }

  //if (req.query.sortBy) {
  //  const parts = req.query.sortBy.split(":");
  //  //sort by unknown field, accessing it with[], short if statmant to assighn 1 or -1 depending on the str in part[1]
  //  sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  //}

  try {
    await req.user
      .populate({
        path: "recipes",
        options: { sort: { date: -1 } },
        match,
      })
      .execPopulate();

    res.send(req.user.recipes);
  } catch (e) {
    res.status(500).send({ msg: e.message });
  }
});

/**
 * @route   POST api/recipes
 * @desc    Create A Recipe
 * @access  Private
 */

router.post("/", auth, upload.any(), async (req, res) => {
  try {
    if (!req.user.confirmed) {
      //error rendered in client
      throw new Error("user did not confirm email address");
    }
    //updating tags
    const data = req.body.data;
    const recipeTags = data.tags;
    const dbWrits = [];
    let recipe = new Recipe({
      ...data, //copy over all the fields from req.body to the object
      tags: recipeTags,
      ...(req.body.image && { image: req.body.image }),
      owner: req.user._id,
    });
    dbWrits.push(recipe.save());
    const response = { recipe: { ...recipe._doc } };
    recipeTags.forEach((tag) => {
      dbWrits.push(
        Tag.findOneAndUpdate(
          { name: tag, owner: req.user._id },
          { $inc: { count: 1 } },
          {
            new: true,
            upsert: true, // Make this update into an upsert
          }
        )
      );
    });
    await Promise.allSettled(dbWrits);
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
    if (!recipe) {
      throw new Error("Recipe coul'd not be found");
    }
    const dbWrits = [];
    //await recipe.removeTagsFromUser(req.user);
    dbWrits.push(recipe.remove());
    const tagsToDecrement = recipe.tags;
    recipe.tags.forEach((tag) => {
      dbWrits.push(
        Tag.findOneAndUpdate(
          { name: tag, owner: req.user._id },
          { $inc: { count: -1 } },
          {
            new: true,
            upsert: true, // Make this update into an upsert
          }
        )
      );
    });
    await Promise.allSettled(dbWrits);
    const response = { _id: req.params.id };
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
    let data = req.body.data;
    //get current recipe
    let recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      throw new Error("no recipe found!");
    }
    //list of current tags
    const currentTags = recipe.tags;
    //list of new tags
    const newTags = req.body.data.tags;
    //all change in tags
    let tagsDiffrent = [
      ...currentTags.filter((x) => !newTags.includes(x)),
      ...newTags.filter((x) => !currentTags.includes(x)),
    ];
    //what is not in tagsDiff and current currentTags needs to be
    let tagsToAdd = tagsDiffrent.filter((x) => !currentTags.includes(x));
    //what is not in currentTags and current currentTags needs to be
    let tagsToDelete = tagsDiffrent.filter((x) => !newTags.includes(x));

    const dbWrits = [];
    tagsToDelete.forEach((tag) => {
      dbWrits.push(
        Tag.findOneAndUpdate(
          { name: tag, owner: req.user._id },
          { $inc: { count: -1 } },
          {
            new: true,
            upsert: true, // Make this update into an upsert
          }
        )
      );
    });

    tagsToAdd.forEach((tag) => {
      dbWrits.push(
        Tag.findOneAndUpdate(
          { name: tag, owner: req.user._id },
          { $inc: { count: 1 } },
          {
            new: true,
            upsert: true, // Make this update into an upsert
          }
        )
      );
    });

    //update recipe fields
    data = {
      ...data,
      ...(req.body.image ? { image: req.body.image } : { image: null }),
    };
    Object.keys(data).forEach((update) => (recipe[update] = data[update]));
    dbWrits.push(recipe.save());
    await Promise.allSettled(dbWrits);
    res.status(201).json({ recipe });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
