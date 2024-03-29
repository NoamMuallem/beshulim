import Tag from "../models/tagModel";
import { UserSchema } from "models/userModel";
import Recipe from "../models/recipeModel";
import cloudinary from "../utils/cloudinary";

export default class RecipeController {
  static async populateUserRecipes(
    user: typeof UserSchema,
    limit: number | null = null,
    createdOnBefore: Date | null = null,
    tags: string | null = null,
    text: string | null = null,
    ingredientsArray: string | null
  ) {
    //parse the ingredients array
    const ingredientsJsonStringArray =
      ingredientsArray && JSON.parse(ingredientsArray);
    //reduce the array to one string for regEx
    const ingredientsString =
      ingredientsJsonStringArray &&
      ingredientsJsonStringArray.reduce(function (
        prevVal: string,
        currVal: string,
        idx: number
      ) {
        return idx == 0 ? currVal : prevVal + "| " + currVal;
      },
      "");
    await user
      .populate({
        path: "recipes",
        match: {
          ...(tags && { tags: { $all: JSON.parse(tags) } }),
          ...(text && {
            name: { $regex: new RegExp(text, "i") },
          }),
          ...(ingredientsJsonStringArray && {
            ingredients: {
              $regex: new RegExp(ingredientsString, "i"),
            },
          }),
          ...(createdOnBefore && {
            createdAt: { $lt: createdOnBefore },
          }),
        },
        options: {
          sort: { createdAt: -1 },
          ...(limit && { limit: limit }),
        },
        select: ["name", "image", "tags", "createdAt"],
      })
      .execPopulate();

    return user.recipes;
  }

  static async createARecipe(
    user: typeof UserSchema,
    image: string,
    data: any
  ) {
    const recipeTags = data.tags;
    const dbWrits = [];
    let uploadedResponse = null;
    if (image) {
      uploadedResponse = await cloudinary.uploader.upload(
        image.replace(/(\r\n|\n|\r|\"|\')/gm, ""),
        {
          upload_preset: "dev_setups",
        }
      );
    }
    let recipe: typeof Recipe = new Recipe({
      ...data, //copy over all the fields from req.body to the object
      tags: recipeTags,
      ...(image && { image }),
      owner: user._id,
      ...(uploadedResponse && { image: uploadedResponse.url }),
    });
    dbWrits.push(recipe.save());
    recipeTags.forEach((tag: string) => {
      dbWrits.push(
        Tag.findOneAndUpdate(
          { name: tag, owner: user._id },
          { $inc: { count: 1 } },
          {
            new: true,
            upsert: true, // Make this update into an upsert
          }
        )
      );
    });
    await Promise.allSettled(dbWrits);

    return { recipe: { ...recipe._doc } };
  }

  static async deleteRecipe(user: typeof UserSchema, recipeId: string) {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      throw new Error("Recipe coul'd not be found");
    }
    const dbWrits = [];
    //await recipe.removeTagsFromUser(req.user);
    dbWrits.push(recipe.remove());

    //recipes tags we need to increament by -1
    recipe.tags.forEach((tag: string) => {
      dbWrits.push(
        Tag.findOneAndUpdate(
          { name: tag, owner: user._id },
          { $inc: { count: -1 } },
          {
            new: true,
            upsert: true, // Make this update into an upsert
          }
        )
      );
    });
    await Promise.allSettled(dbWrits);
    return { _id: recipeId };
  }

  static async updateRecipe(
    user: typeof UserSchema,
    recipeId: string,
    data: any,
    image: string
  ) {
    //get current recipe
    let recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      throw new Error("no recipe found!");
    }
    //list of current tags
    const currentTags = recipe.tags;
    //list of new tags
    const newTags = data.tags;
    //all change in tags
    let tagsDiffrent = [
      ...currentTags.filter((x: string) => !newTags.includes(x)),
      ...newTags.filter((x: string) => !currentTags.includes(x)),
    ];
    //what is not in tagsDiff and current currentTags needs to be
    let tagsToAdd = tagsDiffrent.filter((x) => !currentTags.includes(x));
    //what is not in currentTags and current currentTags needs to be
    let tagsToDelete = tagsDiffrent.filter((x) => !newTags.includes(x));

    const dbWrits = [];
    tagsToDelete.forEach((tag) => {
      dbWrits.push(
        Tag.findOneAndUpdate(
          { name: tag, owner: user._id },
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
          { name: tag, owner: user._id },
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
      ...(image ? { image } : { image: null }),
    };
    Object.keys(data).forEach((update) => (recipe[update] = data[update]));
    dbWrits.push(recipe.save());
    await Promise.allSettled(dbWrits);
    return recipe;
  }

  static async getRecipe(user: typeof UserSchema, _id: string) {
    const recipe = await Recipe.findOne({ _id, owner: user._id });
    if (!recipe) {
      throw new Error("no recipe was found");
    }

    return recipe;
  }
}
