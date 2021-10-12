import { Router } from "express";
import RecipeScrapperController from "../../controllers/recipeScrapperController";
const router = Router();

/**
 * @route   Post api/scrapper/url
 * @desc    Get a new recipe from url
 * @access  Private
 */

//TODO: add auth middleware and make private
router.post("/", async (req: any, res: any) => {
  try {
    const recipe = await RecipeScrapperController.scrapeRecipe(req.body.url);
    res.status(200).json(recipe);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
