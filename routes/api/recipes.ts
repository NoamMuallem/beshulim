import { Router } from "express";
import auth from "../../middleware/auth";
import upload from "../../middleware/image-upload";
import RecipeController from "../../controllers/recipesController";

const router = Router();

/**
 * @route   GET api/recipes/:id
 * @desc    Get specific recipe
 * @access  Private
 */

router.get("/:id", auth, async (req: any, res: any) => {
  try {
    const recipe = await RecipeController.getRecipe(
      req.user._id,
      req.params.id
    );
    res.send(recipe);
  } catch (e) {
    res.status(500).send({ msg: e.message });
  }
});

/**
 * @route   GET api/recipes
 * @desc    Get User Recipes
 * @access  Private
 */

//api/recipes/?limit=5 - limit amount of results
//api/recipes/?createdOnBefore=<timestamp> - instead of skip - to prevent indexing and allow scalling,
//the client will return a date of creation thet from it show results (with limit)
//api/recipes/?tags=["<tag name>"] - an array os strings - the tags to search by
//api/recipes/?text="free text" - free text search in the recipe name - IMPATIENT: no spaces, plus signs instead
router.get("/", auth, async (req: any, res: any) => {
  try {
    const query = req.query;

    const recipes = await RecipeController.populateUserRecipes(
      req.user,
      query.limit,
      query.createdOnBefore,
      query.tags,
      query.text
    );

    res.send(recipes);
  } catch (e) {
    res.status(500).send({ msg: e.message });
  }
});

/**
 * @route   POST api/recipes
 * @desc    Create A Recipe
 * @access  Private
 */

router.post("/", auth, upload.any(), async (req: any, res: any) => {
  try {
    if (!req.user.confirmed) {
      //error rendered in client - will not allow users to add recipes if the email address is not confirmed
      throw new Error("user did not confirm email address");
    }

    const response = await RecipeController.createARecipe(
      req.user,
      req.body.image,
      req.body.data
    );

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

router.delete("/:id", auth, async (req: any, res: any) => {
  try {
    const response = await RecipeController.deleteRecipe(
      req.user,
      req.params.id
    );

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
router.patch("/:id", auth, upload.any(), async (req: any, res: any) => {
  try {
    let data = req.body.data;
    const recipe = await RecipeController.updateRecipe(
      req.user,
      req.params.id,
      data,
      req.body.image
    );
    res.status(201).json({ recipe });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

export default router;
