import { Ingredient } from "./ingredient.js";
import { Template } from "./template.js";

export { Recipe };

//class with recipe attributes

class Recipe {

    constructor ({id, name, servings, ingredients, time, description, appliance, ustensils}){
        this.id = id;
        this.name = name;
        this.servings = servings;
        this.ingredients = [];

        for (let ingredient of ingredients) {
            let ingredientObj = new Ingredient (ingredient);
            this.ingredients.push(ingredientObj);
        }
        
        this.time = time;
        this.description = description;
        this.appliance = appliance;
        this.ustensils = ustensils;
    }

    displayRecipe () {
        this.htmlIngredients = this.displayRecipeIngredients();
        return Template.fillTemplate('recipe', this);
    }

    displayRecipeIngredients () {
        let htmlIngredients = "";
        for (let ingredient of this.ingredients) {
            htmlIngredients += Template.fillTemplate('recipe-ingredient', ingredient);
        }
        return htmlIngredients;
    }

}