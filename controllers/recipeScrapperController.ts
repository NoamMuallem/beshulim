import got from "got";
import jsdom from "jsdom";
import imageToBase64 from "image-to-base64";
const { JSDOM } = jsdom;

export default class RecipeScrapperController {
  static async scrapeRecipe(url: string) {
    const response = await got(url);
    const dom = new JSDOM(response.body);
    const allScriptsTags = dom.window.document.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    let recipeScript = null;
    allScriptsTags.forEach((tag) => {
      if (tag?.textContent?.includes("Recipe")) {
        recipeScript = tag.textContent;
      }
    });

    if (recipeScript) {
      let recipeToReturn: { [key: string]: string } = {};
      const recipeObject = JSON.parse(recipeScript); // do whatever you want here
      recipeToReturn["image"] = await imageToBase64(recipeObject["image"]); // Path to the image
      recipeToReturn["name"] = recipeObject["name"];
      recipeToReturn["recipeIngredient"] =
        recipeObject["recipeIngredient"].join("\r\n");
      //if the ingerdients is of type string, copy it
      if (typeof recipeObject["recipeInstructions"] === "string") {
        recipeToReturn["recipeInstructions"] =
          recipeObject["recipeInstructions"];
      } else {
        //if of type object
        recipeToReturn["recipeInstructions"] = recipeObject[
          "recipeInstructions"
        ]
          .map((object: { [key: string]: string }) =>
            object.text ? object.text : object
          )
          .join("\r\n");
      }
      recipeToReturn["tags"] = recipeObject["keywords"];
      return recipeToReturn;
    } else {
      throw new Error("failed to scrape recipe");
    }
  }
}
