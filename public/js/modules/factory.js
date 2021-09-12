import { Recipe } from "./recipe.js";

export { Factory };

class Factory {

    static createRecipes (jsonRecipes) {
        let recipes = [];
        for (let jsonRecipe of jsonRecipes) {
            let recipe = new Recipe (jsonRecipe);
            recipes.push(recipe);
        }

        return recipes;
    }
}