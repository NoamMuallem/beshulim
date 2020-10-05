const { Router } = require("express");
const auth = require("../../middleware/auth");

const router = Router();

/**
 * @route   GET api/shopping-list
 * @desc    Get User Recipes
 * @access  Private
 */

router.get("/", auth, async (req, res) => {
  try {
    res.send(req.user.shoppingList);
  } catch (e) {
    res.status(500).send();
  }
});

/**
 * @route   POST api/shopping-list
 * @desc    Create An Recipe
 * @access  Private
 */

router.post("/", auth, async (req, res) => {
  req.user.shoppingList = req.body.shoppingList;

  try {
    await req.user.save();
    res.status(201).send("saved");
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
